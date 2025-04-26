import { isSuperAdmin } from '@penx/libs/isSuperAdmin'
import { prisma } from '@penx/db'
import { uniqueId } from '@penx/unique-id'
import { BillingCycle, PlanType, SubscriptionStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

const ONE_MONTH_SECOND = 60 * 60 * 24 * 30

export const couponRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return prisma.coupon.findMany()
  }),

  batchCreate: protectedProcedure
    .input(
      z.object({
        months: z.number(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx.token.uid)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only super admins can create coupons',
        })
      }
      const arr = Array(input.amount)
        .fill(null)
        .map((_, index) => {
          return prisma.coupon.create({
            data: {
              planId: '0',
              code: uniqueId(),
              duration: ONE_MONTH_SECOND * input.months,
            },
          })
        })
      await Promise.all(arr)
      return true
    }),

  useCouponCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.code },
      })

      if (!coupon) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Coupon code is invalid',
        })
      }

      if (coupon.isUsed) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Coupon code is used',
        })
      }

      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { isUsed: true },
      })

      const site = await prisma.site.findUniqueOrThrow({
        where: { id: ctx.activeSiteId },
      })

      const now = Date.now()
      let endedAt = now + coupon.duration * 1000

      if (site.sassBelieverPeriodEnd) {
        const remainTime =
          site.sassBelieverPeriodEnd.getTime() > now
            ? site.sassBelieverPeriodEnd.getTime() - now
            : 0

        endedAt = now + coupon.duration * 1000 + remainTime
      }

      await prisma.site.update({
        where: { id: ctx.activeSiteId },
        data: {
          sassBillingCycle:
            site.sassBillingCycle === BillingCycle.BELIEVER
              ? BillingCycle.BELIEVER
              : BillingCycle.COUPON,
          sassPlanType: PlanType.PRO,
          sassBelieverPeriodEnd: new Date(endedAt),
        },
      })

      return true
    }),
})

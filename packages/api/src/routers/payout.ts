import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { PayoutType } from '@penx/db/client'
import { Balance } from '@penx/types'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const payoutRouter = router({
  withdrawSiteIncome: protectedProcedure
    .input(
      z.object({
        amount: z
          .number()
          .min(5000, { message: 'amount must be at least $50' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const siteId = ctx.activeSiteId
      return prisma.$transaction(
        async (tx) => {
          const site = await tx.site.findUniqueOrThrow({
            where: { id: siteId },
          })

          if (site.userId !== userId) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No permission to withdraw funds from this site',
            })
          }

          const amount = input.amount
          const balance = site.balance as Balance

          if (amount > balance.withdrawable) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Insufficient funds to withdraw this amount',
            })
          }

          balance.withdrawable -= amount
          balance.withdrawing += amount

          const newSite = await tx.site.update({
            where: { id: siteId },
            data: { balance },
          })

          await tx.payout.create({
            data: {
              type: PayoutType.SITE_INCOME,
              userId,
              siteId,
              amount,
            },
          })
          return newSite
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  withdrawCommission: protectedProcedure
    .input(
      z.object({
        amount: z
          .number()
          .min(5000, { message: 'amount must be at least $50' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      return prisma.$transaction(
        async (tx) => {
          const user = await tx.user.findUniqueOrThrow({
            where: { id: userId },
          })

          const amount = input.amount
          const balance = user.commissionBalance as Balance

          if (amount > balance.withdrawable) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Insufficient funds to withdraw this amount',
            })
          }

          balance.withdrawable -= amount
          balance.withdrawing += amount

          await tx.user.update({
            where: { id: userId },
            data: { commissionBalance: balance },
          })

          await tx.payout.create({
            data: {
              userId,
              type: PayoutType.COMMISSION,
              amount,
            },
          })
          return true
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),
})

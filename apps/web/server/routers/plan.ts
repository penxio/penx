import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { prisma } from '@penx/db'
import { uniqueId } from '@/lib/unique-id'
import { SubscriptionStatus } from '@penx/db/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const planRouter = router({
  subscribe: protectedProcedure
    .input(
      z.object({
        duration: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const duration = input.duration * 1000
      // const subscription = await prisma.subscription.findFirst({
      //   where: { userId: ctx.token.uid },
      // })

      // if (subscription) {
      //   const remainTime =
      //     subscription.endedAt.getTime() > Date.now()
      //       ? subscription.endedAt.getTime() - Date.now()
      //       : 0

      //   const startedAt = new Date()
      //   const endedAt = startedAt.getTime() + duration + remainTime

      //   await prisma.subscription.update({
      //     where: { id: subscription.id },
      //     data: {
      //       status: SubscriptionStatus.ACTIVE,
      //       startedAt,
      //       endedAt: new Date(endedAt),
      //       userId: ctx.token.uid,
      //     },
      //   })
      // } else {
      //   const startedAt = new Date()
      //   const endedAt = startedAt.getTime() + duration

      //   await prisma.subscription.create({
      //     data: {
      //       planId: '0',
      //       status: SubscriptionStatus.ACTIVE,
      //       startedAt,
      //       endedAt: new Date(endedAt),
      //       userId: ctx.token.uid,
      //     },
      //   })
      // }

      return true
    }),
})

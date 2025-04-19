import { prisma } from '@penx/db'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const referralRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const referrals = await prisma.referral.findMany({
      where: { inviterId: ctx.token.uid },
      include: {
        user: {
          include: {
            sites: true,
          },
        },
      },
    })
    return referrals
  }),
})

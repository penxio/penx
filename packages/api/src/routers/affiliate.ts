import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { Balance } from '@penx/types'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const affiliateRouter = router({
  commissionBalance: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.token.uid },
    })
    if (!user?.commissionBalance) {
      return {
        withdrawable: 0,
        withdrawing: 0,
        locked: 0,
      } as Balance
    }
    return user?.commissionBalance as Balance
  }),
})

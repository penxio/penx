import { z } from 'zod'
import { prisma } from '@penx/db'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const memberRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await prisma.subscription.findMany({
      where: { siteId: ctx.activeSiteId },
      include: {
        user: true,
        product: true,
      },
    })
    return subscriptions
  }),
})

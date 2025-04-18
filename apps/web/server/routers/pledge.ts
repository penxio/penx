import { prisma } from '@penx/db'
import Stripe from 'stripe'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const pledgeRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const orders = await prisma.order.findMany({
      where: { siteId: ctx.activeSiteId },
      include: {
        product: true,
      },
    })

    return orders.map((order) => ({
      ...order,
      customer: order.customer as any as Stripe.Customer,
    }))
  }),
})

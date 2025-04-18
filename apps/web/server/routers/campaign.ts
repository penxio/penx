import { prisma } from '@penx/db'
import { redisKeys } from '@/lib/redisKeys'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const campaignRouter = router({
  myCampaign: publicProcedure.query(async ({ ctx }) => {
    const result = await prisma.campaign.findFirst({
      where: { siteId: ctx.activeSiteId },
    })

    return result
  }),

  byId: publicProcedure.input(z.string().uuid()).query(async ({ input }) => {
    const campaign = await prisma.campaign.findFirst({
      where: { id: input },
    })
    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Campaign not found',
      })
    }
    return campaign
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const products = await prisma.product.findMany({
      where: { siteId: ctx.activeSiteId },
    })
    return products
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        goal: z.number(),
        details: z.any().optional(),
        image: z.any().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const priceUnit = 100
          const siteId = ctx.activeSiteId
          const oauthStripe = await getOAuthStripe(siteId)

          const product = await oauthStripe.products.create({
            name: input.name,
            description: input.description || input.name,
            tax_code: 'txcd_10000000',
          })

          const price = await oauthStripe.prices.create({
            unit_amount: priceUnit, // $10
            currency: 'usd',
            product: product.id,
          })

          return await tx.campaign.create({
            data: {
              ...input,
              stripeProductId: product.id,
              stripePriceId: price.id,
              goal: input.goal,
              siteId,
              userId: ctx.token.uid,
            },
          })
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        details: z.any().optional(),
        image: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      const product = await prisma.campaign.update({
        where: { id: input.id },
        data: rest,
      })

      return product
    }),
})

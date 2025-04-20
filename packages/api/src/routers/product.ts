import { cacheHelper } from '@penx/libs/cache-header'
import { prisma } from '@penx/db'
import { redisKeys } from '@/lib/redisKeys'
import { StripeInfo } from '@/lib/types'
import { ProductType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, publicProcedure, router } from '../trpc'

// f558c387-10ab-4f83-919d-5e66e0ec9f38
export const productRouter = router({
  byId: publicProcedure.input(z.string().uuid()).query(async ({ input }) => {
    const product = await prisma.product.findFirst({
      where: { id: input },
    })
    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product not found',
      })
    }
    return product
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
        price: z.number(),
        description: z.string().optional(),
        details: z.any().optional(),
        image: z.any().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const siteId = ctx.activeSiteId
          const oauthStripe = await getOAuthStripe(siteId)

          const product = await oauthStripe.products.create({
            name: input.name,
            description: input.description || input.name,
            tax_code: 'txcd_10000000',
          })

          const price = await oauthStripe.prices.create({
            unit_amount: input.price, // $10
            currency: 'usd',
            product: product.id,
          })

          return await tx.product.create({
            data: {
              ...input,
              stripe: {
                productId: product.id,
                priceId: price.id,
              } as StripeInfo,
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

  updateProduct: protectedProcedure
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
      const product = await prisma.product.update({
        where: { id: input.id },
        data: rest,
      })

      return product
    }),

  updatePrice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        price: z.string().min(1, { message: 'Price is required' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = ctx.activeSiteId
      const price = parseInt((Number(input.price) * 100) as any)

      if (price === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Price must be greater than 0',
        })
      }

      const product = await prisma.product.findUniqueOrThrow({
        where: { id: input.id },
      })

      const oauthStripe = await getOAuthStripe(siteId)

      const stripeInfo = product.stripe as StripeInfo

      await oauthStripe.prices.update(stripeInfo.priceId, {
        active: false,
      })

      const newPrice = await oauthStripe.prices.create({
        unit_amount: price, // $10
        currency: 'usd',
        product: stripeInfo.productId!,
      })

      await prisma.product.update({
        where: { id: input.id },
        data: {
          price,
          stripe: {
            ...stripeInfo,
            priceId: newPrice.id,
          } as StripeInfo,
        },
      })

      if (product.type === ProductType.TIER) {
        revalidateTag(`${ctx.activeSiteId}-tiers`)
        await cacheHelper.updateMySites(ctx.token.uid, null)
      }

      return product
    }),
})

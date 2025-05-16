import { z } from 'zod'
import { prisma } from '@penx/db'
import { ContributionType, Platform } from '@penx/db/client'
import { protectedProcedure, router } from '../trpc'

export const rewardsRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    const userAddress = ctx.token.address

    return prisma.rewardRequest.findMany({
      where: {
        AND: {
          userAddress: userAddress,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(ContributionType),
        platform: z.nativeEnum(Platform).optional(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userAddress = ctx.token.address

      const newRewardRequest = await prisma.rewardRequest.create({
        data: {
          userAddress: userAddress,
          type: input.type,
          platform: input.platform,
          content: input.content,
        },
      })

      return newRewardRequest
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userAddress = ctx.token.address
      await prisma.rewardRequest.deleteMany({
        where: {
          id: input,
          userAddress: userAddress,
          status: 'PENDING',
        },
      })
    }),
})

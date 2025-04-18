import { prisma } from '@penx/db'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const accessTokenRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.accessToken.findMany({
        where: { siteId: input.siteId },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        title: z.string(),
        expiredAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const record = await prisma.accessToken.create({
        data: {
          siteId: input.siteId,
          title: input.title,
          userId: ctx.token.uid,
          token: nanoid(36),
          expiredAt: input.expiredAt,
        },
      })
      return record
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.accessToken.delete({
        where: {
          id: input.id,
        },
      })
      return { success: true }
    }),
})

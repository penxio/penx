import { z } from 'zod'
import { prisma } from '@penx/db'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const structTemplateRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    let list = await prisma.structTemplate.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return list
  }),

  publish: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1, { message: 'Type name is required' }),
        pluralName: z.string().min(1, { message: 'Type name is required' }),
        type: z.string().optional(),
        color: z.string().optional(),
        about: z.string().optional(),
        columns: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const item = await prisma.structTemplate.findUnique({
        where: { id },
        select: { id: true },
      })

      if (!item) {
        await prisma.structTemplate.create({
          data: {
            id,
            ...data,
            publishedAt: new Date(),
            userId: ctx.token.uid,
            siteId: ctx.token.activeSiteId,
          },
        })
      } else {
        await prisma.structTemplate.update({
          where: { id: input.id },
          data: {
            ...data,
            publishedAt: new Date(),
          },
        })
      }

      return true
    }),

  use: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.structTemplate.update({
        where: { id: input.id },
        data: {
          usedCount: { increment: 1 },
        },
      })

      return true
    }),
})

import { z } from 'zod'
import { prisma } from '@penx/db'
import { StructType } from '@penx/types'
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
        name: z.string().min(1, { message: 'Type name is required' }),
        pluralName: z.string().min(1, { message: 'Type name is required' }),
        type: z.string(),
        color: z.string().optional(),
        about: z.string().optional(),
        columns: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (Object.values(StructType).includes(input.type as StructType)) {
        throw new Error('Unique code is used, please try another code')
      }

      const item = await prisma.structTemplate.findUnique({
        where: { type: input.type },
        select: { type: true, userId: true },
      })

      if (!item) {
        await prisma.structTemplate.create({
          data: {
            ...input,
            publishedAt: new Date(),
            userId: ctx.token.uid,
            siteId: ctx.token.activeSiteId,
          },
        })
      } else {
        if (ctx.token.uid !== item.userId) {
          throw new Error('No permission to update this struct')
        }

        await prisma.structTemplate.update({
          where: { type: input.type },
          data: {
            ...input,
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

import { z } from 'zod'
import { prisma } from '@penx/db'
import { OperationType } from '@penx/model-type'
import { protectedProcedure, router } from '../trpc'

export const syncRouter = router({
  push: protectedProcedure
    .input(
      z.object({
        operation: z.string(),
        table: z.string(),
        siteId: z.string(),
        key: z.string(),
        data: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.operation === OperationType.CREATE) {
        await (prisma as any)[input.table].create({
          data: input.data,
        })
      } else if (input.operation === OperationType.UPDATE) {
        await (prisma as any)[input.table].update({
          where: { id: input.key },
          data: input.data,
        })
      } else if (input.operation === OperationType.DELETE) {
        if (input.table === 'area') {
          return prisma.$transaction(
            async (tx) => {
              const creations = await tx.creation.findMany({
                where: { areaId: input.key },
              })
              await tx.creationTag.deleteMany({
                where: {
                  creationId: { in: creations.map((c) => c.id) },
                },
              })
              await tx.creation.deleteMany({ where: { areaId: input.key } })
              await tx.area.delete({ where: { id: input.key } })

              return true
            },
            {
              maxWait: 10000, // default: 2000
              timeout: 20000, // default: 5000
            },
          )
        }

        await (prisma as any)[input.table].delete({
          where: { id: input.key },
        })
        return true
      }
    }),
})

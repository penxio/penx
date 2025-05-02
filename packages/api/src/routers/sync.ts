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
        await (prisma as any)[input.table].delete({
          where: { id: input.key },
        })
      }
    }),
})

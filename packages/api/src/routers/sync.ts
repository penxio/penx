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
      //
    }),
})

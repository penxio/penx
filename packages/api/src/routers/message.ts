import { prisma } from '@penx/db'
import { Message } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const messageRouter = router({
  listByChannelId: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
        page: z.number().int().positive().default(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { channelId, page } = input

      try {
        const [messages, pageInfo] = await prisma.message
          .paginate({
            where: { channelId },
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  displayName: true,
                  image: true,
                },
              },
            },
          })
          .withPages({ limit: 20, page, includePageCount: true })

        return {
          messages,
          currentPage: pageInfo.currentPage,
          pageCount: pageInfo.pageCount,
          total: pageInfo.totalCount,
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          cause: error,
        })
      }
    }),
})

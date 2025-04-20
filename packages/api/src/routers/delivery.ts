import { prisma } from '@penx/db'
import { DeliveryStatus } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const deliveryRouter = router({
  // List deliveries with filtering and pagination
  list: protectedProcedure
    .input(
      z.object({
        newsletterId: z.string(),
        status: z.nativeEnum(DeliveryStatus).optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { newsletterId, status, cursor, limit } = input

      return prisma.delivery.findMany({
        where: {
          newsletterId,
          ...(status && { status }),
        },
        include: {
          subscriber: true,
        },
        take: limit,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { createdAt: 'desc' },
      })
    }),

  // Update delivery status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          'PENDING',
          'SENDING',
          'SENT',
          'FAILED',
          'BOUNCED',
          'COMPLAINED',
        ]),
        errorMessage: z.string().optional(),
        messageId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status, errorMessage, messageId } = input

      return prisma.delivery.update({
        where: { id },
        data: {
          status,
          ...(errorMessage && { errorMessage }),
          ...(messageId && { messageId }),
          ...(status === 'SENT' && { sentAt: new Date() }),
        },
      })
    }),

  // Get delivery stats for a newsletter
  getStats: protectedProcedure
    .input(
      z.object({
        newsletterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stats = await prisma.delivery.groupBy({
        by: ['status'],
        where: {
          newsletterId: input.newsletterId,
        },
        _count: {
          status: true,
        },
      })

      return {
        total: stats.reduce((acc, curr) => acc + curr._count.status, 0),
        stats: stats.reduce(
          (acc, curr) => {
            acc[curr.status.toLowerCase()] = curr._count.status
            return acc
          },
          {} as Record<string, number>,
        ),
      }
    }),

  // Retry failed deliveries
  retry: protectedProcedure
    .input(
      z.object({
        newsletterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.delivery.updateMany({
        where: {
          newsletterId: input.newsletterId,
          status: 'FAILED',
        },
        data: {
          status: 'PENDING',
          errorMessage: null,
          messageId: null,
          sentAt: null,
        },
      })
    }),
})

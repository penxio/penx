import { prisma } from '@penx/db'
import { NewsletterStatus } from '@penx/db/client'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const newsletterRouter = router({
  // List newsletters with pagination and filtering
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        status: z.nativeEnum(NewsletterStatus).optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId, status, cursor, limit } = input

      return prisma.newsletter.findMany({
        where: {
          siteId,
          ...(status && { status }),
        },
        include: {
          deliveries: {
            select: {
              status: true,
            },
          },
        },
        take: limit,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { createdAt: 'desc' },
      })
    }),

  // Get a single newsletter by ID
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.newsletter.findUnique({
        where: { id: input.id },
        include: {
          deliveries: {
            include: {
              subscriber: true,
            },
          },
        },
      })
    }),

  // Create a new newsletter
  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        title: z.string(),
        subject: z.string(),
        content: z.string(),
        creationId: z.string().optional(),
        scheduledAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.newsletter.create({
        data: {
          ...input,
          creatorId: ctx.token.uid,
          status: input.scheduledAt ? 'SCHEDULED' : 'DRAFT',
        },
      })
    }),

  // Update an existing newsletter
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        subject: z.string().optional(),
        content: z.string().optional(),
        scheduledAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return prisma.newsletter.update({
        where: { id },
        data: {
          ...data,
          // Update status if scheduledAt changes
          ...(data.scheduledAt && { status: 'SCHEDULED' }),
        },
      })
    }),

  // Delete a newsletter
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.newsletter.delete({
        where: { id: input.id },
      })
    }),

  // Send a newsletter immediately
  send: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First update newsletter status to SENDING
      const newsletter = await prisma.newsletter.update({
        where: { id: input.id },
        data: {
          status: 'SENDING',
          sentAt: new Date(),
        },
      })

      // Get all active subscribers
      const subscribers = await prisma.subscriber.findMany({
        where: {
          siteId: newsletter.siteId,
          status: 'ACTIVE',
        },
      })

      // Create delivery records for each subscriber
      await prisma.delivery.createMany({
        data: subscribers.map((subscriber) => ({
          newsletterId: newsletter.id,
          subscriberId: subscriber.id,
          siteId: newsletter.siteId,
          status: 'PENDING',
        })),
      })

      // Return updated newsletter
      return newsletter
    }),

  // Get newsletter statistics
  getStats: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const deliveries = await prisma.delivery.groupBy({
        by: ['status'],
        where: {
          newsletterId: input.id,
        },
        _count: {
          status: true,
        },
      })

      return deliveries.reduce(
        (acc, curr) => {
          acc[curr.status.toLowerCase()] = curr._count.status
          return acc
        },
        {} as Record<string, number>,
      )
    }),
})

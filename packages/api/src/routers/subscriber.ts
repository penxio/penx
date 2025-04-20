import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createSubscriptionConfirmEmail } from '@penx/api/lib/getPostEmailTpl'
import { prisma } from '@penx/db'
import {
  SubscriberStatus,
  SystemEmailStatus,
  SystemEmailType,
} from '@prisma/client'
import { ImportResult } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { protectedProcedure, router } from '../trpc'

async function handleSubscriber({
  tx = prisma,
  siteId,
  email,
  userId,
  source = 'form',
}: {
  tx?: any
  siteId: string
  email: string
  userId: string
  source?: string
}) {
  const confirmExpireMinutes = 30
  const confirmExpireAt = new Date(
    Date.now() + confirmExpireMinutes * 60 * 1000,
  )

  const subscriber = await tx.subscriber.findFirst({
    where: { siteId, email },
  })

  if (subscriber?.status === SubscriberStatus.ACTIVE) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Email "${email}" already exists`,
    })
  }

  const confirmationCode = uniqueId()
  const unsubscribeCode = uniqueId()

  let updatedSubscriber

  if (subscriber) {
    const metadata = (subscriber.metadata as Record<string, any>) || {}
    const expireAt = metadata.confirmExpireAt
      ? new Date(metadata.confirmExpireAt)
      : null

    if (
      subscriber.status === SubscriberStatus.PENDING &&
      expireAt &&
      expireAt > new Date()
    ) {
      updatedSubscriber = await tx.subscriber.update({
        where: { id: subscriber.id },
        data: {
          metadata: {
            ...metadata,
            confirmExpireAt: confirmExpireAt.toISOString(),
          },
        },
      })
    } else {
      updatedSubscriber = await tx.subscriber.update({
        where: { id: subscriber.id },
        data: {
          status: SubscriberStatus.PENDING,
          confirmationCode,
          unsubscribeCode,
          confirmedAt: null,
          unsubscribedAt: null,
          metadata: {
            confirmExpireAt: confirmExpireAt.toISOString(),
          },
        },
      })
    }
  } else {
    updatedSubscriber = await tx.subscriber.create({
      data: {
        siteId,
        email,
        userId,
        source,
        status: SubscriberStatus.PENDING,
        confirmationCode,
        unsubscribeCode,
        confirmedAt: null,
        unsubscribedAt: null,
        metadata: {
          confirmExpireAt: confirmExpireAt.toISOString(),
        },
      },
    })
  }

  if (
    !subscriber?.metadata?.confirmExpireAt ||
    subscriber.metadata.confirmExpireAt <= new Date() ||
    subscriber.status === SubscriberStatus.UNSUBSCRIBED
  ) {
    await createConfirmationEmail({
      tx,
      email,
      confirmationCode,
      siteId,
    })
  }

  return updatedSubscriber
}

export const subscriberRouter = router({
  all: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.subscriber.findMany({
        where: { siteId: input.siteId },
      })
    }),

  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        status: z.nativeEnum(SubscriberStatus).optional(),
        search: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId, status, search, cursor, limit } = input

      const items = await prisma.subscriber.findMany({
        where: {
          siteId,
          ...(status && { status }),
          ...(search && {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          }),
        },
        select: {
          id: true,
          email: true,
          status: true,
          createdAt: true,
          confirmedAt: true,
          unsubscribedAt: true,
          source: true,
        },
        orderBy: [{ createdAt: 'desc' }],
        take: limit + 1,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem!.id
      }

      return {
        items,
        nextCursor,
      }
    }),

  count: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        status: z.nativeEnum(SubscriberStatus).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.subscriber.count({
        where: {
          siteId: input.siteId,
          ...(input.status && { status: input.status }),
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        emails: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          for (const email of input.emails) {
            try {
              await handleSubscriber({
                tx,
                siteId: input.siteId,
                email,
                userId: ctx.token.uid,
                source: 'admin_add',
              })
            } catch (error: any) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message:
                  error.code === 'P2002'
                    ? `Email "${email}" already exists`
                    : error.message,
              })
            }
          }
          return true
        },
        {
          maxWait: 1000 * 60,
          timeout: 1000 * 60,
        },
      )
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(SubscriberStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.subscriber.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (tx) => {
        // 1. Delete all related deliveries first
        await tx.delivery.deleteMany({
          where: { subscriberId: input.id },
        })

        // 2. Delete the subscriber
        return tx.subscriber.delete({
          where: { id: input.id },
        })
      })
    }),

  addSubscriber: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        email: z.string().email(),
        source: z.string().default('admin_add'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await handleSubscriber({
          siteId: input.siteId,
          email: input.email,
          userId: ctx.token.uid,
          source: input.source,
        })
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            error.code === 'P2002'
              ? `Email "${input.email}" already exists`
              : error.message,
        })
      }
    }),

  importSubscribers: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        subscribers: z.array(
          z.object({
            email: z.string().email(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result: ImportResult = {
        success: 0,
        failed: [],
        total: input.subscribers.length,
      }

      for (const sub of input.subscribers) {
        try {
          await prisma.$transaction(async (tx) => {
            await handleSubscriber({
              tx,
              siteId: input.siteId,
              email: sub.email,
              userId: ctx.token.uid,
              source: 'bulk_import',
            })
          })
        } catch (error: any) {
          result.failed.push({
            email: sub.email,
            reason:
              error.code === 'P2002'
                ? 'Already exists'
                : error.message || 'Unknown error',
          })
          result.success = result.total - result.failed.length
        }
      }

      return result
    }),
})

async function createConfirmationEmail(params: {
  tx: any
  email: string
  confirmationCode: string
  siteId: string
}) {
  const { tx, email, confirmationCode, siteId } = params

  const site = await tx.site.findUnique({
    where: { id: siteId },
    select: { name: true },
  })

  const confirmUrl = `${process.env.NEXT_PUBLIC_URL}/api/newsletter/confirm/${confirmationCode}`

  const emailContent = createSubscriptionConfirmEmail({
    siteName: site?.name,
    confirmUrl,
  })

  await tx.systemEmail.create({
    data: {
      type: SystemEmailType.SUBSCRIPTION_CONFIRM,
      status: SystemEmailStatus.PENDING,
      toEmail: email,
      subject: emailContent.subject,
      content: emailContent.content,
    },
  })
}

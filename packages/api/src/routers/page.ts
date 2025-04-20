import { cacheHelper } from '@penx/libs/cache-header'
import {
  editorDefaultValue,
  FREE_PLAN_PAGE_LIMIT,
  FRIEND_DATABASE_NAME,
} from '@penx/constants'
import { prisma } from '@penx/db'
import { CreationType, Prop } from '@penx/types'
import { Option } from '@penx/types'
import { Creation, CreationStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createPage } from '../lib/createPage'
import { initPages } from '../lib/initPages'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const pageRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let pages = await prisma.creation.findMany({
        where: {
          siteId: input.siteId,
          isJournal: false,
          isPage: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      const hasBuiltin = pages.some((p) => p.slug === 'friends')

      if (!hasBuiltin) {
        await initPages(input.siteId, ctx.token.uid)
        pages = await prisma.creation.findMany({
          where: {
            siteId: input.siteId,
            isJournal: false,
            isPage: true,
          },
          orderBy: { createdAt: 'desc' },
        })
      }

      return pages
    }),

  getPage: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        pageId: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageId = '', date = '' } = input
      if (!pageId && !date) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either pageId or date is required.',
        })
      }

      if (pageId) {
        return prisma.creation.findUniqueOrThrow({
          where: { id: pageId },
          include: {
            creationTags: { include: { tag: true } },
            mold: true,
            authors: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                    displayName: true,
                    ensName: true,
                  },
                },
              },
            },
          },
        })
      } else {
        const page = await prisma.creation.findFirst({
          where: { siteId: input.siteId, date },
          include: {
            creationTags: { include: { tag: true } },
            authors: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                    displayName: true,
                    ensName: true,
                  },
                },
              },
            },
          },
        })

        if (page) return page

        const { id } = await createPage({
          userId: ctx.token.uid,
          siteId: input.siteId,
          date,
          title: '',
          isJournal: true,
        })

        return prisma.creation.findUniqueOrThrow({
          where: { id },
          include: {
            creationTags: { include: { tag: true } },
            authors: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                    displayName: true,
                    ensName: true,
                  },
                },
              },
            },
          },
        })
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const count = await prisma.creation.count({
        where: { siteId: input.siteId, isPage: true },
      })

      if (ctx.isFree && count >= FREE_PLAN_PAGE_LIMIT) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have reached the free plan page limit.',
        })
      }

      const page = await createPage({
        userId: ctx.token.uid,
        siteId: input.siteId,
        title: '',
      })
      return page
    }),

  submitFriendLink: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        data: z.object({
          name: z.string().min(1, { message: 'Name is required' }),
          introduction: z.string().min(5, { message: 'Name is required' }),
          avatar: z.string(),
          url: z.string().url(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const siteId = input.siteId
      const mold = await prisma.mold.findFirstOrThrow({
        where: {
          siteId,
          type: CreationType.FRIEND,
        },
      })

      const props = (mold.props as Prop[]).reduce(
        (acc, prop) => {
          let value = input.data[prop.slug]
          if (prop.slug === 'status') value = 'pending'
          return {
            ...acc,
            [prop.id]: value,
          }
        },
        {} as Record<string, any>,
      )

      const creation = await prisma.creation.create({
        data: {
          siteId: input.siteId,
          userId,
          title: input.data.name,
          description: input.data.introduction,
          moldId: mold.id,
          type: mold.type,
          props,
          status: CreationStatus.PUBLISHED,
          publishedAt: new Date(),
          content: JSON.stringify(editorDefaultValue),
          i18n: {},
          authors: {
            create: [
              {
                siteId: input.siteId,
                userId,
              },
            ],
          },
        },
      })

      revalidateTag(`${input.siteId}-friends`)

      return creation
    }),
})

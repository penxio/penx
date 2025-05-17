import { z } from 'zod'
import { prisma } from '@penx/db'
import { cacheHelper } from '@penx/libs/cache-header'
import { getDefaultStructs } from '@penx/libs/getDefaultStructs'
import { revalidateSite } from '@penx/libs/revalidateSite'
import { CreationType, Prop, PropType } from '@penx/types'
import { protectedProcedure, router } from '../trpc'

export const structRouter = router({
  listBySite: protectedProcedure.query(async ({ ctx, input }) => {
    let list = await prisma.struct.findMany({
      where: {
        siteId: ctx.activeSiteId,
      },
      orderBy: {
        id: 'desc',
      },
    })

    const sortKeys = [
      CreationType.ARTICLE,
      CreationType.NOTE,
      CreationType.AUDIO,
      CreationType.IMAGE,
      CreationType.BOOKMARK,
      CreationType.FRIEND,
      CreationType.PROJECT,
    ]

    return list.sort((a, b) => {
      const indexA = sortKeys.indexOf(a.type as any)
      const indexB = sortKeys.indexOf(b.type as any)
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return 0
    })
  }),

  list: protectedProcedure.query(async ({ ctx, input }) => {
    let list = await prisma.struct.findMany({
      where: {
        siteId: ctx.activeSiteId,
      },
      orderBy: {
        id: 'desc',
      },
    })
    if (!list.length) {
      await prisma.struct.createMany({
        data: getDefaultStructs({
          userId: ctx.token.uid,
          siteId: ctx.activeSiteId,
        }),
      })

      list = await prisma.struct.findMany({
        where: {
          siteId: ctx.activeSiteId,
        },
        orderBy: {
          id: 'desc',
        },
      })
    }

    const sortKeys = [
      CreationType.ARTICLE,
      CreationType.NOTE,
      CreationType.AUDIO,
      CreationType.IMAGE,
      CreationType.BOOKMARK,
      CreationType.FRIEND,
      CreationType.PROJECT,
    ]

    return list.sort((a, b) => {
      const indexA = sortKeys.indexOf(a.type as any)
      const indexB = sortKeys.indexOf(b.type as any)
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return 0
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: 'Type name is required' }),
        type: z.string().min(1, { message: 'Type slug is required' }),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.struct.create({
        data: {
          ...input,
          siteId: ctx.activeSiteId,
          userId: ctx.token.uid,
          props: [],
          updatedAt: new Date(),
        },
      })
      return true
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z
          .string()
          .min(1, { message: 'Type name is required' })
          .optional(),
        type: z
          .string()
          .min(1, { message: 'Type slug is required' })
          .optional(),
        content: z.string().optional(),
        props: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await prisma.struct.update({
        where: { id },
        data,
      })

      const site = await prisma.site.findUniqueOrThrow({
        where: { id: ctx.activeSiteId },
        include: { domains: true },
      })

      const collaborators = await prisma.collaborator.findMany({
        where: { siteId: ctx.activeSiteId },
      })
      for (const item of collaborators) {
        await cacheHelper.updateMySites(item.userId, null)
      }

      revalidateSite(site.domains)
      return true
    }),
})

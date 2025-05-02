import { TRPCError } from '@trpc/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createAreaInputSchema, updateAreaInputSchema } from '@penx/constants'
import { prisma } from '@penx/db'
import { AreaType, ChargeMode } from '@penx/db/client'
import { cacheHelper } from '@penx/libs/cache-header'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { revalidateSite } from '@penx/libs/revalidateSite'
import { protectedProcedure, router } from '../trpc'

export const areaRouter = router({
  listSiteAreas: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const areas = await prisma.area.findMany({
        where: {
          siteId: input.siteId,
        },
      })
      return areas
    }),

  list: protectedProcedure.query(async ({ ctx, input }) => {
    const areas = await prisma.area.findMany({
      where: {
        siteId: ctx.activeSiteId,
      },
      include: { product: true },
    })

    return areas
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const cachedArea = await cacheHelper.getArea(input)
    if (cachedArea) return cachedArea

    const area = await prisma.area.findUniqueOrThrow({
      where: { id: input },
      include: {
        creations: true,
      },
    })

    await cacheHelper.updateArea(area.id, area as any)

    return area
  }),

  createArea: protectedProcedure
    .input(createAreaInputSchema)
    .mutation(async ({ ctx, input }) => {
      const molds = await prisma.mold.findMany({
        where: { siteId: ctx.activeSiteId },
      })
      const area = await prisma.area.create({
        data: {
          siteId: ctx.activeSiteId,
          userId: ctx.token.uid,
          favorites: [],
          widgets: getInitialWidgets(molds),
          updatedAt: new Date(),
          ...input,
        },
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

      await cacheHelper.updateArea(area.id, null)

      return area
    }),

  updateArea: protectedProcedure
    .input(updateAreaInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      const area = await prisma.area.update({
        where: { id },
        data: {
          ...rest,
        },
      })

      await cacheHelper.updateArea(area.id, null)

      revalidateTag(`${area.siteId}-area-${area.slug}`)

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
      return area
    }),

  deleteArea: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      return prisma.$transaction(
        async (tx) => {
          const site = await tx.site.findFirst({ where: { userId } })
          const area = await tx.area.findUnique({ where: { id: input.id } })

          if (site?.userId !== area?.userId || site?.id !== area?.siteId) {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'No permission to delete area',
            })
          }

          if (area?.isGenesis) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Blog area cannot be deleted',
            })
          }

          await tx.area.delete({ where: { id: input.id } })

          await cacheHelper.updateArea(input.id, null)
          return true
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 20000, // default: 5000
        },
      )
    }),
})

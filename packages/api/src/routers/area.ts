import { AreaType, ChargeMode } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { cacheHelper } from '@penx/libs/cache-header'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { revalidateSite } from '@penx/libs/revalidateSite'
import { protectedProcedure, router } from '../trpc'

export const areaRouter = router({
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
    .input(
      z.object({
        logo: z.string().min(1, { message: 'Please upload your avatar' }),
        name: z.string().min(1, {
          message: 'Name must be at least 1 characters.',
        }),
        slug: z.string().min(1, { message: 'Slug is required' }),
        description: z.string(),
        about: z.string().optional(),
        chargeMode: z.nativeEnum(ChargeMode).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const area = await prisma.area.create({
        data: {
          siteId: ctx.activeSiteId,
          userId: ctx.token.uid,
          favorites: [],
          catalogue: [],
          widgets: getInitialWidgets(),
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
    .input(
      z.object({
        id: z.string(),
        type: z.nativeEnum(AreaType).optional(),
        logo: z
          .string()
          .min(1, { message: 'Please upload your avatar' })
          .optional(),
        name: z
          .string()
          .min(1, {
            message: 'Name must be at least 1 characters.',
          })
          .optional(),
        slug: z.string().min(1, { message: 'Slug is required' }).optional(),
        description: z.string().optional(),
        about: z.string().optional(),
        chargeMode: z.nativeEnum(ChargeMode).optional(),
        catalogue: z.any().optional(),
        widgets: z.any().optional(),
        favorites: z.any().optional(),
      }),
    )
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

import { TRPCError } from '@trpc/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { AreaType, ChargeMode } from '@penx/db/client'
import { cacheHelper } from '@penx/libs/cache-header'
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

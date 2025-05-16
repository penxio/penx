import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { protectedProcedure, router } from '../trpc'

export const assetRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        pageNum: z.number().optional().default(1),
        pageSize: z.number().optional().default(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageNum, pageSize } = input
      const offset = (pageNum - 1) * pageSize
      const list = await prisma.asset.findMany({
        where: { isTrashed: false, siteId: input.siteId },
        include: {
          assetLabels: { include: { label: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: offset,
      })

      return list
    }),

  getByUrl: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await prisma.asset.findFirst({
        where: { url: input.url },
      })
    }),

  trashedAssets: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        pageNum: z.number().optional().default(1),
        pageSize: z.number().optional().default(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageNum, pageSize } = input
      const offset = (pageNum - 1) * pageSize
      return prisma.asset.findMany({
        where: { isTrashed: true, siteId: input.siteId },
        include: {
          assetLabels: { include: { label: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: offset,
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        url: z.string(),
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
        isPublic: z.boolean(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const asset = await prisma.asset.findFirst({
        where: {
          siteId: input.siteId,
          url: input.url,
        },
      })

      if (asset) {
        // throw new TRPCError({
        //   code: 'BAD_REQUEST',
        //   message: 'Asset already exists',
        // })
        return true
      }

      await prisma.asset.create({
        data: {
          userId: ctx.token.uid,
          ...input,
        },
      })
      return true
    }),

  trash: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.asset.update({
        where: { id: input.assetId },
        data: { isTrashed: true },
      })
      return true
    }),

  delete: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.asset.delete({ where: { id: input.assetId } })
      return true
    }),

  updatePublicStatus: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.asset.update({
        where: { id: input.assetId },
        data: { isPublic: input.isPublic },
      })
      return true
    }),
})

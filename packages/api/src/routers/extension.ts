import Redis from 'ioredis'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { Extension } from '@penx/db/client'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const ALL_EXTENSIONS_KEY = 'extensions:all'

const redis = new Redis(process.env.REDIS_URL!)

export const extensionRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const value = await redis.get(ALL_EXTENSIONS_KEY)
    if (value) {
      return JSON.parse(value) as Extension[]
    }
    const extensions = await prisma.extension.findMany({
      orderBy: { createdAt: 'desc' },
    })
    await redis.set(ALL_EXTENSIONS_KEY, JSON.stringify(extensions))
    return extensions
  }),

  myExtensions: protectedProcedure.query(async ({ ctx }) => {
    const extensions = await prisma.extension.findMany({
      where: { userId: ctx.token.uid },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return extensions
  }),

  canReleaseExtension: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ext = await prisma.extension.findUnique({
        where: { name: input.name },
      })
      if (!ext) return true

      if (ext.userId === ctx.token.uid && input.name === ext.name) {
        return true
      }
      return false
    }),

  upsertExtension: publicProcedure
    .input(
      z.object({
        name: z.string(),
        manifest: z.string(),
        readme: z.string(),
        logo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ext = await prisma.extension.findUnique({
        where: { name: input.name },
      })

      if (ext) {
        await prisma.extension.update({
          where: { id: ext.id },
          data: {
            manifest: input.manifest,
            readme: input.readme,
            logo: input.logo,
          },
        })
      } else {
        await prisma.extension.create({
          data: {
            userId: ctx.token.uid,
            name: input.name,
            title: input.name,
            manifest: input.manifest,
            readme: input.readme,
            logo: input.logo,
          },
        })
      }

      const extensions = await prisma.extension.findMany({
        orderBy: { createdAt: 'desc' },
      })
      await redis.set(ALL_EXTENSIONS_KEY, JSON.stringify(extensions))
      return true
    }),

  increaseInstallationCount: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ext = await prisma.extension.findUnique({
        where: { name: input.name },
      })

      if (!ext) return true

      await prisma.extension.update({
        where: { id: ext.id },
        data: { installationCount: ext.installationCount + 1 },
      })

      const extensions = await prisma.extension.findMany({
        orderBy: { createdAt: 'desc' },
      })
      await redis.set(ALL_EXTENSIONS_KEY, JSON.stringify(extensions))
      return true
    }),
})

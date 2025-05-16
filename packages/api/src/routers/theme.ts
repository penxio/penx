import Redis from 'ioredis'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { Theme } from '@penx/db/client'
import { getTokenByInstallationId } from '../lib/getTokenByInstallationId'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const ALL_EXTENSIONS_KEY = 'theme:all'

const redis = new Redis(process.env.REDIS_URL!)

export const themeRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const value = await redis.get(ALL_EXTENSIONS_KEY)
    if (value) {
      return JSON.parse(value) as Theme[]
    }
    const extensions = await prisma.theme.findMany({
      orderBy: { createdAt: 'desc' },
    })
    await redis.set(ALL_EXTENSIONS_KEY, JSON.stringify(extensions))
    return extensions
  }),

  myThemes: protectedProcedure.query(async ({ ctx }) => {
    const extensions = await prisma.theme.findMany({
      where: { userId: ctx.token.uid },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return extensions
  }),

  canPublishTheme: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const theme = await prisma.theme.findUnique({
        where: { name: input.name },
      })
      if (!theme) return true

      if (theme.userId === ctx.token.uid && input.name === theme.name) {
        return true
      }
      return false
    }),

  upsertTheme: publicProcedure
    .input(
      z.object({
        name: z.string(),
        manifest: z.string(),
        readme: z.string(),
        logo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const theme = await prisma.theme.findUnique({
        where: { name: input.name },
      })

      if (theme) {
        await prisma.theme.update({
          where: { id: theme.id },
          data: {
            manifest: input.manifest,
            readme: input.readme,
            logo: input.logo,
          },
        })
      } else {
        await prisma.theme.create({
          data: {
            userId: ctx.token.uid,
            name: input.name,
            manifest: input.manifest,
            readme: input.readme,
            logo: input.logo,
          },
        })
      }

      const themes = await prisma.theme.findMany({
        orderBy: { createdAt: 'desc' },
      })
      await redis.set(ALL_EXTENSIONS_KEY, JSON.stringify(themes))
      return true
    }),

  increaseInstallationCount: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const theme = await prisma.theme.findUnique({
        where: { name: input.name },
      })

      if (!theme) return true

      await prisma.theme.update({
        where: { id: theme.id },
        data: { installationCount: theme.installationCount + 1 },
      })

      const themes = await prisma.theme.findMany({
        orderBy: { createdAt: 'desc' },
      })
      await redis.set(ALL_EXTENSIONS_KEY, JSON.stringify(themes))
      return true
    }),
})

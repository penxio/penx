import { TRPCError } from '@trpc/server'
import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { LoginStatus } from '@penx/constants'
import { prisma } from '@penx/db'
import { SessionData } from '@penx/types'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

const prefix = 'desktop-login'
const getKey = (token: string) => `${prefix}:${token}`

export const desktopRouter = router({
  loginByToken: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const value = await redis.get(`${prefix}:${input}`)
      const { userId, status } = JSON.parse(value!)

      if (!userId || status !== LoginStatus.CONFIRMED) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please confirm login in web',
        })
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          sites: {
            include: {
              areas: true,
            },
          },
        },
      })

      const site = user.sites[0]!
      const session = {} as SessionData
      session.message = ''
      session.uid = user.id
      session.userId = user.id
      session.email = user.email || ''
      session.ensName = user?.ensName as string
      session.name = user.name as string
      session.picture = user.image as string
      session.image = user.image as string
      session.siteId = site.id
      session.activeSiteId = site.id
      session.planType = site.sassPlanType
      session.subscriptionStatus = site.sassSubscriptionStatus || ''
      session.currentPeriodEnd = site?.sassCurrentPeriodEnd as any as string
      session.believerPeriodEnd = site?.sassBelieverPeriodEnd as any as string
      session.billingCycle = site?.sassBillingCycle as any as string
      session.isLoggedIn = true

      session.accessToken = jwt.sign(
        {
          sub: user.id,
          siteId: site.id,
          activeSiteId: site.id,
          planType: site.sassPlanType,
        },
        process.env.NEXTAUTH_SECRET!,
        {
          expiresIn: '365d',
        },
      )

      return session
    }),

  getLoginStatus: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const value = await redis.get(getKey(input.token))

      if (!value) return { status: LoginStatus.INIT }

      return { status: JSON.parse(value).status }
    }),

  confirmLogin: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await redis.set(
        `${prefix}:${input.token}`,
        JSON.stringify({
          userId: ctx.token.uid,
          status: LoginStatus.CONFIRMED,
        }),
      )
      return true
    }),

  cancelLogin: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await redis.set(
        `${prefix}:${input.token}`,
        JSON.stringify({
          userId: ctx.token.uid,
          status: LoginStatus.CANCELED,
        }),
      )
      return true
    }),
})

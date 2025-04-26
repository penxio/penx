import { LoginStatus } from '@penx/constants'
import { prisma } from '@penx/db'
import { TRPCError } from '@trpc/server'
import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

const getKey = (cliToken: string) => `cli-login:${cliToken}`

export const cliRouter = router({
  loginByToken: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const value = await redis.get(`cli-login:${input}`)
      const { userId, status } = JSON.parse(value!)

      if (!userId || status !== LoginStatus.CONFIRMED) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please confirm login in web',
        })
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      })

      return {
        token: jwt.sign({ sub: user.id }, process.env.NEXTAUTH_SECRET!, {
          expiresIn: '365d',
        }),
        user,
      }
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
        `cli-login:${input.token}`,
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
        `cli-login:${input.token}`,
        JSON.stringify({
          userId: ctx.token.uid,
          status: LoginStatus.CANCELED,
        }),
      )
      return true
    }),
})

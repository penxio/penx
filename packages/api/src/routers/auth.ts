import { TRPCError } from '@trpc/server'
import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'
import { sendEmail } from '@penx/api/lib/aws-ses-client'
import { isProd, redisKeys, ROOT_DOMAIN } from '@penx/constants'
import { prisma } from '@penx/db'
import { ProviderType } from '@penx/db/client'
import { getGoogleUserInfo } from '@penx/libs/getGoogleUserInfo'
import {
  initUserByEmailLoginCode,
  initUserByGoogleToken,
} from '@penx/libs/initUser'
import { SessionData } from '@penx/types'
import { generateNonce } from '../lib/generateNonce'
import { getLoginCodeEmailTpl } from '../lib/getLoginCodeEmailTpl'
import { getMe } from '../lib/getMe'
import { getRegisterEmailTpl } from '../lib/getRegisterEmailTpl'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(alphabet, 10)

export const authRouter = router({
  getNonce: publicProcedure.query(async ({ ctx, input }) => {
    let nonce = generateNonce()
    return nonce
  }),

  loginByPersonalToken: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.accessToken.findUnique({
        where: { token: input },
      })
      if (!token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid personal token',
        })
      }

      return getMe(token.userId, true)
    }),

  registerByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        ref: z.string().optional(),
        userId: z.string().optional(),
        password: z.string().min(6, {
          message: 'Password must be at least 6 characters.',
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await Promise.all([
        prisma.user.findFirst({
          where: {
            email: input.email,
          },
        }),
      ])

      if (user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already registered',
        })
      }

      const token = jwt.sign(
        {
          ...input,
          ref: input.ref || '',
        },
        process.env.NEXTAUTH_SECRET!,
        {
          expiresIn: '30d',
        },
      )

      const prefix = isProd ? 'https://' : 'http://'
      const content = getRegisterEmailTpl(
        `${prefix}${ROOT_DOMAIN}/validate-email?token=${token}`,
      )
      const result = await sendEmail({
        from: 'PenX<no-reply@penx.io>',
        to: [input.email],
        subject: 'Verify your email address',
        html: content,
        text: content.replace(/<[^>]*>/g, ''),
      })
      return true
    }),

  sendEmailLoginCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const alphabet = '0123456789'
      const nanoid = customAlphabet(alphabet, 6)
      let code: string

      const expireSeconds = 60 * 100
      while (true) {
        code = nanoid()

        const setResult = await redis.set(
          redisKeys.emailLoginCode(code),
          input.email,
          'EX',
          expireSeconds,
          'NX',
        )

        if (setResult === 'OK') {
          break
        }
      }

      const content = getLoginCodeEmailTpl(code)

      const result = await sendEmail({
        from: 'PenX<no-reply@penx.io>',
        to: [input.email],
        subject: `Login to PenX, Code: ${code}`,
        html: content,
        text: content.replace(/<[^>]*>/g, ''),
      })

      return code
    }),
})

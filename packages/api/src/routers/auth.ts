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
  initUserByGoogleInfo,
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
      const [account, gmailAccount, user] = await Promise.all([
        prisma.account.findFirst({
          where: {
            providerAccountId: input.email,
          },
        }),
        prisma.account.findFirst({
          where: {
            providerType: ProviderType.GOOGLE,
            email: input.email,
          },
        }),
        prisma.user.findFirst({
          where: {
            email: input.email,
          },
        }),
      ])

      if (account || user || gmailAccount) {
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

  loginWithEmailLoginCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = await redis.get(redisKeys.emailLoginCode(input.code))
      if (!email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid login code',
        })
      }

      const account = await initUserByEmailLoginCode(email, input.userId)
      const user = account.user
      const site = user.sites[0]

      const session = {} as SessionData
      session.message = ''
      session.uid = user.id
      session.userId = user.id
      session.email = user.email || ''
      session.ensName = user?.ensName as string
      session.name = user.name as string
      session.picture = user.image as string
      session.image = user.image as string
      session.siteId = site?.id
      session.activeSiteId = site?.id
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
})

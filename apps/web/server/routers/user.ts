import { sendEmail } from '@/lib/aws-ses-client'
import { isProd, NETWORK, NetworkNames, ROOT_DOMAIN } from '@/lib/constants'
// import { prisma } from '@penx/db'
import { prisma } from '@penx/db'
import { Balance } from '@/lib/types'
import { ProviderType } from '@penx/db/client'
import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { customAlphabet } from 'nanoid'
import { headers } from 'next/headers'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { z } from 'zod'
import { generateNonce } from '../lib/generateNonce'
import { getEthPrice } from '../lib/getEthPrice'
import { getMe } from '../lib/getMe'
import { getRegisterEmailTpl } from '../lib/getRegisterEmailTpl'
import { hashPassword } from '../lib/hashPassword'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(alphabet, 10)

export const userRouter = router({
  getNonce: publicProcedure.query(async ({ ctx, input }) => {
    let nonce = generateNonce()
    return nonce
  }),

  list: publicProcedure.query(async ({ ctx, input }) => {
    return prisma.user.findMany({ take: 20 })
  }),

  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return prisma.user.findUniqueOrThrow({
      where: { id: input },
      include: {
        sites: {
          include: { domains: true },
        },
      },
    })
  }),

  search: publicProcedure
    .input(
      z.object({
        q: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.user.findMany({
        where: {
          OR: [
            {
              displayName: {
                contains: input.q,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: input.q,
                mode: 'insensitive',
              },
            },
          ],
        },
        take: 10,
      })
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUnique({ where: { id: ctx.token.uid } })
  }),

  getReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({ where: { id: ctx.token.uid } })
    if (user?.referralCode) return user?.referralCode
    try {
      const referralCode = nanoid()
      await prisma.user.update({
        where: { id: ctx.token.uid },
        data: { referralCode },
      })
      return referralCode
    } catch (error) {
      const referralCode = nanoid()
      await prisma.user.update({
        where: { id: ctx.token.uid },
        data: { referralCode },
      })
      return referralCode
    }
  }),

  updateReferralCode: protectedProcedure
    .input(
      z.object({
        code: z
          .string()
          .min(4, { message: 'Code length should greater the three' })
          .max(10, { message: 'Code length should not exceed ten' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await prisma.user.update({
          where: { id: ctx.token.uid },
          data: {
            referralCode: input.code,
          },
        })
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This code is existed, please try another code.',
        })
      }
    }),

  getAddressByUserId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { accounts = [] } = await prisma.user.findUniqueOrThrow({
        where: { id: input },
        include: {
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      })
      const account = accounts.find(
        (a) => a.providerType === ProviderType.WALLET,
      )
      return account?.providerAccountId || ''
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string().optional(),
        displayName: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          ...input,
        },
      })
    }),

  ethPrice: publicProcedure.query(({ ctx }) => {
    return getEthPrice()
  }),

  getUserInfoByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          displayName: true,
          image: true,
        },
      })
      return user
    }),

  accountsByUser: publicProcedure.query(({ ctx }) => {
    return prisma.account.findMany({
      where: { userId: ctx.token.uid },
    })
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

  linkWallet: publicProcedure
    .input(
      z.object({
        signature: z.string(),
        message: z.string(),
        address: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const publicClient = createPublicClient({
        chain: NETWORK === NetworkNames.BASE_SEPOLIA ? baseSepolia : base,
        transport: http(),
      })

      const valid = await publicClient.verifyMessage({
        address: input.address as any,
        message: input.message,
        signature: input.signature as any,
      })

      if (!valid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid signature',
        })
      }

      const account = await prisma.account.findFirst({
        where: { providerAccountId: input.address },
      })

      if (account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This address already linked',
        })
      }

      await prisma.account.create({
        data: {
          userId: ctx.token.uid,
          providerType: ProviderType.WALLET,
          providerAccountId: input.address,
        },
      })
    }),

  linkPassword: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await prisma.account.findFirst({
        where: { providerAccountId: input.username },
      })

      if (account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This username already existed',
        })
      }

      await prisma.account.create({
        data: {
          userId: ctx.token.uid,
          providerType: ProviderType.PASSWORD,
          providerAccountId: input.username,
          accessToken: await hashPassword(input.password),
        },
      })
    }),

  disconnectAccount: publicProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accounts = await prisma.account.findMany({
        where: { userId: ctx.token.uid },
      })

      if (accounts.length === 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot disconnect the last account',
        })
      }

      const account = accounts.find((a) => a.id === input.accountId)

      if (account && account.providerType === ProviderType.GOOGLE) {
        await prisma.user.update({
          where: { id: ctx.token.uid },
          data: {
            email: null,
          },
        })
      }

      await prisma.account.delete({
        where: { id: input.accountId },
      })
      return true
    }),
})

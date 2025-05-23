import ky from 'ky'
import { customAlphabet } from 'nanoid'
import { defaultNavLinks, defaultEditorContent } from '@penx/constants'
import { prisma } from '@penx/db'
import {
  CollaboratorRole,
  CreationStatus,
  ProviderType,
  SubdomainType,
  User,
} from '@penx/db/client'
import { cacheHelper } from '@penx/libs/cache-header'
import { AppleLoginInfo } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { decodeAppleToken } from './decodeAppleToken'
import { getGoogleUserInfo } from './getGoogleUserInfo'
import { hashPassword } from './hashPassword'

const SEVEN_DAYS = 60 * 60 * 24 * 7

const includeUser = {
  include: {
    sites: {
      include: {
        areas: true,
        domains: true,
      },
    },
  },
} as const

const includeAccount = {
  include: {
    user: includeUser,
  },
} as const

const getSiteInfo = (newUser: User) => {
  const siteInfo = {
    userId: newUser.id,
    socials: {},
    themeName: 'sue',
    themeConfig: {},
    navLinks: defaultNavLinks,
    about: JSON.stringify(defaultEditorContent),
    collaborators: {
      create: {
        userId: newUser.id,
        role: CollaboratorRole.OWNER,
      },
    },
    channels: {
      create: {
        name: 'general',
        type: 'TEXT',
      },
    },
  } as const
  return siteInfo
}

export async function initUserByGoogleToken(
  accessToken: string,
  ref: string,
  userId?: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const info = await getGoogleUserInfo(accessToken)

      const account = await tx.account.findUnique({
        where: { providerAccountId: info.sub },
        ...includeAccount,
      })

      if (account) return account.user

      const user = await tx.user.findUnique({
        where: { email: info.email },
        ...includeUser,
      })

      if (user) return user!

      let newUser = await tx.user.create({
        data: {
          id: userId ? userId : undefined,
          pid: await generatePID(tx),
          name: info.name,
          displayName: info.name,
          email: info.email,
          image: info.picture,
          accounts: {
            create: [
              {
                providerType: ProviderType.GOOGLE,
                providerAccountId: info.sub,
                providerInfo: info,
              },
            ],
          },
        },
      })

      if (ref) {
        const inviter = await tx.user.findUnique({
          where: { referralCode: ref },
        })
        if (inviter) {
          await tx.referral.create({
            data: {
              inviterId: inviter.id,
              userId: newUser.id,
            },
          })
        }
      }

      return tx.user.findUniqueOrThrow({
        where: { id: newUser.id },
        ...includeUser,
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

export async function initUserByAppleToken({
  accessToken,
  username,
  ref,
  userId,
  clientId,
}: AppleLoginInfo) {
  return prisma.$transaction(
    async (tx) => {
      const info = await decodeAppleToken(accessToken, clientId)
      const email = info.email || ''

      const account = await tx.account.findUnique({
        where: { providerAccountId: info.sub },
        ...includeAccount,
      })

      if (account) return account.user

      const user = await tx.user.findUnique({
        where: { email },
        ...includeUser,
      })

      if (user) return user!

      const name = username || email.split('@')[0]

      let newUser = await tx.user.create({
        data: {
          id: userId ? userId : undefined,
          pid: await generatePID(tx),
          name: name,
          displayName: name,
          email: email,
          accounts: {
            create: [
              {
                providerType: ProviderType.GOOGLE,
                providerAccountId: info.sub,
                providerInfo: info,
              },
            ],
          },
        },
      })

      if (ref) {
        const inviter = await tx.user.findUnique({
          where: { referralCode: ref },
        })
        if (inviter) {
          await tx.referral.create({
            data: {
              inviterId: inviter.id,
              userId: newUser.id,
            },
          })
        }
      }

      return tx.user.findUniqueOrThrow({
        where: { id: newUser.id },
        ...includeUser,
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

export async function initUserByEmail(
  email: string,
  password: string,
  ref: string,
  userId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
        ...includeUser,
      })

      if (user) return user

      const [name] = email.split('@')

      let newUser = await tx.user.create({
        data: {
          id: userId ? userId : undefined,
          pid: await generatePID(tx),
          name: name,
          displayName: name,
          email: email,
          password: await hashPassword(password),
        },
      })

      if (ref) {
        const inviter = await tx.user.findUnique({
          where: { referralCode: ref },
        })
        if (inviter) {
          await tx.referral.create({
            data: {
              inviterId: inviter.id,
              userId: newUser.id,
            },
          })
        }
      }

      return tx.user.findUniqueOrThrow({
        where: { email },
        ...includeUser,
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

export async function initUserByEmailLoginCode(email: string, userId?: string) {
  return prisma.$transaction(
    async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
        ...includeUser,
      })

      if (user) return user

      const [name] = email.split('@')

      let newUser = await tx.user.create({
        data: {
          id: userId ? userId : undefined,
          pid: await generatePID(tx),
          name: name,
          displayName: name,
          email: email,
        },
      })

      return tx.user.findUniqueOrThrow({
        where: { email },
        ...includeUser,
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

async function generatePID(tx: any) {
  let code: string
  const alphabet = '0123456789'
  const nanoid = customAlphabet(alphabet, 6)
  while (true) {
    code = nanoid()
    const user = await tx.user.findUnique({ where: { pid: code } })
    if (!user) break
  }
  return code
}

import ky from 'ky'
import { defaultNavLinks, editorDefaultValue } from '@penx/constants'
import { prisma } from '@penx/db'
import {
  CollaboratorRole,
  CreationStatus,
  ProviderType,
  SubdomainType,
  User,
} from '@penx/db/client'
import { cacheHelper } from '@penx/libs/cache-header'
import { uniqueId } from '@penx/unique-id'
import { hashPassword } from './hashPassword'

const SEVEN_DAYS = 60 * 60 * 24 * 7

const includeAccount = {
  include: {
    user: {
      include: {
        sites: {
          include: {
            areas: true,
            domains: true,
          },
        },
      },
    },
  },
} as const

const getSiteInfo = (newUser: User) => {
  const siteInfo = {
    userId: newUser.id,
    socials: {},
    themeName: 'sue',
    themeConfig: {},
    navLinks: defaultNavLinks,
    about: JSON.stringify(editorDefaultValue),
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

type GoogleLoginInfo = {
  email: string
  openid: string
  picture: string
  name: string
}

export async function initUserByGoogleInfo(
  info: GoogleLoginInfo,
  ref: string,
  userId?: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: info.openid },
        ...includeAccount,
      })

      if (account) return account

      let newUser = await tx.user.create({
        data: {
          id: userId ? userId : undefined,
          name: info.name,
          displayName: info.name,
          email: info.email,
          image: info.picture,
          accounts: {
            create: [
              {
                providerType: ProviderType.GOOGLE,
                providerAccountId: info.openid,
                providerInfo: info,
                email: info.email,
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

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: info.openid },
        ...includeAccount,
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
      const account = await tx.account.findUnique({
        where: { providerAccountId: email },
        ...includeAccount,
      })

      if (account) return account

      const [name] = email.split('@')

      let newUser = await tx.user.create({
        data: {
          id: userId ? userId : undefined,
          name: name,
          displayName: name,
          email: email,
          accounts: {
            create: [
              {
                providerType: ProviderType.EMAIL,
                providerAccountId: email,
                email: email,
                accessToken: await hashPassword(password),
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

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: email },
        ...includeAccount,
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
      const account = await tx.account.findFirst({
        where: {
          OR: [
            {
              providerType: ProviderType.EMAIL,
              providerAccountId: email,
            },
            {
              providerType: ProviderType.GOOGLE,
              email,
            },
          ],
        },
        ...includeAccount,
      })

      if (account) return account

      const [name] = email.split('@')

      let newUser = await tx.user.create({
        data: {
          id: userId ? userId : undefined,
          name: name,
          displayName: name,
          email: email,
          accounts: {
            create: [
              {
                providerType: ProviderType.EMAIL,
                providerAccountId: email,
                email: email,
              },
            ],
          },
        },
      })

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: email },
        ...includeAccount,
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

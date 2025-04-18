import { NETWORK, ROOT_DOMAIN } from '@/lib/constants'
import { getBasePublicClient } from '@/lib/getBasePublicClient'
import { getSiteDomain } from '@/lib/getSiteDomain'
import {
  initUserByAddress,
  initUserByEmail,
  initUserByFarcasterInfo,
  initUserByGoogleInfo,
} from '@/lib/initUser'
import { prisma } from '@penx/db'
import { getServerSession, getSessionOptions } from '@/lib/session'
import {
  AccountWithUser,
  isCancelSubscription,
  isFarcasterLogin,
  isGoogleLogin,
  isPasswordLogin,
  isRegisterByEmail,
  isUpdateProfile,
  isUpdateProps,
  isUseCoupon,
  isWalletLogin,
  SessionData,
} from '@/lib/types'
import { getAccountAddress } from '@/lib/utils'
import { generateNonce } from '@/server/lib/generateNonce'
import { createAppClient, viemConnector } from '@farcaster/auth-client'
import {
  BillingCycle,
  PlanType,
  ProviderType,
  Subscription,
} from '@penx/db/client'
import { compareSync } from 'bcrypt-edge'
import { getIronSession, IronSession } from 'iron-session'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import {
  parseSiweMessage,
  validateSiweMessage,
  type SiweMessage,
} from 'viem/siwe'

// export const runtime = 'edge'

async function updateSession(
  session: IronSession<SessionData>,
  account: AccountWithUser,
) {
  const site = account.user.sites[0]
  session.isLoggedIn = true
  session.message = ''
  session.uid = account.userId
  session.userId = account.userId
  session.address = getAccountAddress(account)
  session.email = account.user.email || ''
  session.ensName = account.user?.ensName as string
  session.name = account.user.name as string
  session.picture = account.user.image as string
  session.image = account.user.image as string
  session.domain = getSiteDomain(site)
  session.siteId = site.id
  session.activeSiteId = site.id
  session.activeAreaId = site.areas[0]?.id || ''
  session.planType = site.sassPlanType
  session.subscriptionStatus = site.sassSubscriptionStatus || ''
  session.currentPeriodEnd = site?.sassCurrentPeriodEnd as any as string
  session.believerPeriodEnd = site?.sassBelieverPeriodEnd as any as string
  session.billingCycle = site?.sassBillingCycle as any as string

  session.accessToken = jwt.sign(
    {
      userId: session.uid,
      address: session.address,
    },
    process.env.NEXTAUTH_SECRET!,
    {
      expiresIn: '30d',
    },
  )

  await session.save()
}

async function registerSiteUser(hostname: string, userId: string) {
  const isRoot =
    hostname === 'localhost:4000' ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN

  if (isRoot) return

  let domain = ''
  const isSubdomain = hostname.endsWith(`.${ROOT_DOMAIN}`)

  if (isSubdomain) {
    domain = hostname.replace(`.${ROOT_DOMAIN}`, '')
  } else {
    domain = hostname
  }

  const domainRes = await prisma.domain.findUnique({
    where: { domain },
    select: { siteId: true },
  })

  if (!domainRes) return

  const siteUser = await prisma.siteUser.findUnique({
    where: {
      userId_siteId: {
        userId,
        siteId: domainRes.siteId,
      },
    },
  })

  if (!siteUser) {
    await prisma.siteUser.create({
      data: { userId, siteId: domainRes.siteId },
    })
  }
}

// login
export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )

  const json = await req.json()
  const hostname = json?.host || ''

  // console.log('=======json:', json)

  if (isGoogleLogin(json)) {
    const ref = json?.ref || ''
    const account = await initUserByGoogleInfo(json, ref)
    await updateSession(session, account)
    await registerSiteUser(hostname, account.userId)
    return Response.json(session)
  }

  if (isWalletLogin(json)) {
    try {
      const siweMessage = parseSiweMessage(json?.message) as SiweMessage

      if (
        !validateSiweMessage({
          address: siweMessage?.address,
          message: siweMessage,
        })
      ) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }

      const publicClient = getBasePublicClient(NETWORK)

      const valid = await publicClient.verifyMessage({
        address: siweMessage?.address,
        message: json?.message,
        signature: json?.signature as any,
      })

      if (!valid) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }

      const address = siweMessage.address.toLowerCase()
      const account = await initUserByAddress(address)
      await updateSession(session, account)
      await registerSiteUser(hostname, account.userId)
      return Response.json(session)
    } catch (e) {
      console.log('wallet auth error======:', e)
    }
  }

  if (isRegisterByEmail(json)) {
    try {
      const decoded = jwt.verify(
        json.validateToken,
        process.env.NEXTAUTH_SECRET!,
      ) as any

      const email = decoded.email
      const password = decoded.password
      const ref = decoded.ref || ''
      const account = await initUserByEmail(email, password, ref)
      await updateSession(session, account)
      await registerSiteUser(hostname, account.userId)
      return Response.json(session)
    } catch (error) {
      session.isLoggedIn = false
      await session.save()
      return Response.json(session)
    }
  }

  if (isFarcasterLogin(json)) {
    try {
      const appClient = createAppClient({
        ethereum: viemConnector(),
      })

      const verifyResponse = await appClient.verifySignInMessage({
        message: json.message as string,
        signature: json.signature as `0x${string}`,
        domain: ROOT_DOMAIN,
        nonce: generateNonce(),
      })
      const { success, fid } = verifyResponse

      if (!success) {
        session.isLoggedIn = false
        await session.save()
        return Response.json(session)
      }

      const account = await initUserByFarcasterInfo({
        fid: fid.toString(),
        name: json.name,
        image: json.pfp,
      })

      await updateSession(session, account)
      await registerSiteUser(hostname, account.userId)
      return Response.json(session)
    } catch (error) {
      session.isLoggedIn = false
      await session.save()
      return Response.json(session)
    }
  }

  if (isPasswordLogin(json)) {
    try {
      const account = await prisma.account.findFirst({
        where: {
          OR: [
            {
              providerType: ProviderType.PASSWORD,
              providerAccountId: json.username,
            },
            {
              providerType: ProviderType.EMAIL,
              providerAccountId: json.username,
            },
          ],
        },
        include: {
          user: {
            include: {
              subscriptions: true,
              sites: { include: { domains: true } },
            },
          },
        },
      })

      if (!account) {
        throw new Error('INVALID_USERNAME')
      }

      const match = compareSync(json.password, account.accessToken || '')
      if (!match) throw new Error('INVALID_PASSWORD')

      await updateSession(session, account)
      await registerSiteUser(hostname, account.userId)
      return Response.json(session)
    } catch (error: any) {
      console.log('error.mess==:', error.message)

      if (error.message === 'INVALID_USERNAME') {
        session.message = 'Invalid username'
      }

      if (error.message === 'INVALID_PASSWORD') {
        session.message = 'Invalid password'
      }

      session.isLoggedIn = false
      await session.save()
      return Response.json(session)
    }
  }

  session.isLoggedIn = false
  await session.save()
  return Response.json(session)
}

export async function PATCH(request: NextRequest) {
  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  const json = await request.json()

  if (isUpdateProps(json)) {
    for (const key of Object.keys(json)) {
      session[key] = json[key]
    }
  }

  if (isUpdateProfile(json)) {
    if (json.displayName) session.name = json.displayName
    if (json.image) session.picture = json.image
  }

  if (isUseCoupon(json)) {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: session.activeSiteId },
    })

    session.planType = PlanType.PRO
    session.billingCycle = BillingCycle.COUPON
    session.believerPeriodEnd =
      site.sassBelieverPeriodEnd?.toISOString() as string
  }

  if (isCancelSubscription(json)) {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: json.siteId },
    })
    session.subscriptionStatus = 'canceled'
    if (site.sassCurrentPeriodEnd) {
      session.currentPeriodEnd = site.sassCurrentPeriodEnd.toISOString()
    }
  }

  // session.updateConfig({
  //   ...sessionOptions,
  //   cookieOptions: {
  //     ...sessionOptions.cookieOptions,
  //     expires: new Date('2024-12-27T00:00:00.000Z'),
  //     maxAge: undefined,
  //   },
  // })

  await session.save()

  return Response.json(session)
}

// read session
export async function GET() {
  const session = await getServerSession()

  if (session?.isLoggedIn !== true) {
    return Response.json({})
  }

  return Response.json(session)
}

// logout
export async function DELETE() {
  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  session.destroy()
  return Response.json({ isLoggedIn: false })
}

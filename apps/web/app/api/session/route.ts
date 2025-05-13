import { getBasePublicClient } from '@/lib/getBasePublicClient'
import { createAppClient, viemConnector } from '@farcaster/auth-client'
import { compareSync } from 'bcrypt-edge'
import { getIronSession, IronSession } from 'iron-session'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { ROOT_DOMAIN } from '@penx/constants'
import { prisma } from '@penx/db'
import {
  BillingCycle,
  PlanType,
  ProviderType,
  Subscription,
} from '@penx/db/client'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { initUserByEmail, initUserByGoogleToken } from '@penx/libs/initUser'
import { getServerSession, getSessionOptions } from '@penx/libs/session'
import {
  AccountWithUser,
  isCancelSubscription,
  isGoogleLogin,
  isPasswordLogin,
  isRegisterByEmail,
  isUpdateProfile,
  isUpdateProps,
  isUseCoupon,
  SessionData,
  UserWithSites,
} from '@penx/types'
import { generateNonce } from '@penx/utils/generateNonce'

// export const runtime = 'edge'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function updateSession(
  session: IronSession<SessionData>,
  user: UserWithSites,
) {
  const site = user?.sites?.[0]

  console.log('======user>>>>>:', user)

  session.isLoggedIn = true
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
  session.planType = site?.sassPlanType
  session.subscriptionStatus = site?.sassSubscriptionStatus || ''
  session.currentPeriodEnd = site?.sassCurrentPeriodEnd as any as string
  session.believerPeriodEnd = site?.sassBelieverPeriodEnd as any as string
  session.billingCycle = site?.sassBillingCycle as any as string

  session.accessToken = jwt.sign(
    {
      siteId: site?.id,
      userId: session.uid,
      activeSiteId: site?.id,
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

  if (isGoogleLogin(json)) {
    const ref = json?.ref || ''
    const userId = json?.userId || ''
    const user = await initUserByGoogleToken(json.accessToken, ref, userId)
    await updateSession(session, user)
    try {
      await registerSiteUser(hostname, user.id)
    } catch (error) {
      console.error('register siteUser error:', error)
    }
    return Response.json(session, { headers })
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
      const userId = decoded.userId || ''
      const user = await initUserByEmail(email, password, ref, userId)
      await updateSession(session, user)
      await registerSiteUser(hostname, user.id)
      return Response.json(session, { headers })
    } catch (error) {
      session.isLoggedIn = false
      await session.save()
      return Response.json(session, { headers })
    }
  }

  if (isPasswordLogin(json)) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: json.username }, { name: json.username }],
        },
        include: {
          subscriptions: true,
          sites: { include: { domains: true } },
        },
      })

      if (!user) {
        throw new Error('INVALID_USERNAME')
      }

      const match = compareSync(json.password, user.password || '')
      if (!match) throw new Error('INVALID_PASSWORD')

      await updateSession(session, user as any)
      await registerSiteUser(hostname, user.id)
      return Response.json(session, { headers })
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
      return Response.json(session, { headers })
    }
  }

  session.isLoggedIn = false
  await session.save()

  return Response.json(session, { headers })
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
      // @ts-ignore
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

  return Response.json(session, { headers })
}

// read session
export async function GET() {
  const session = await getServerSession()

  if (session?.isLoggedIn !== true) {
    return Response.json({}, { headers })
  }

  return Response.json(session, { headers })
}

// logout
export async function DELETE() {
  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  session.destroy()
  return Response.json({ isLoggedIn: false }, { headers })
}

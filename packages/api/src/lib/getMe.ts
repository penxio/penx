import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@penx/db'
import { Site, Subscription, User } from '@penx/db/client'

type Me = User & {
  token?: string
  site: Site
}

export async function getMe(userId: string, needToken = false) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscriptions: true },
  })

  if (!user) new TRPCError({ code: 'NOT_FOUND' })

  const site = await prisma.site.findFirst({
    where: { userId: user?.id },
  })

  return {
    ...user,

    token: jwt.sign(
      {
        sub: userId,
      },
      process.env.NEXTAUTH_SECRET!,
      {
        expiresIn: '365d',
      },
    ),
    site,
  } as Me

  // await redis.set(redisKey, JSON.stringify(user))
}

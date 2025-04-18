import { prisma } from '@penx/db'
import { OAuthApp } from '@octokit/oauth-app'
import { NextResponse } from 'next/server'

const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!
const clientSecret = process.env.GITHUB_CLIENT_SECRET!

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code') as string
  const userId = url.searchParams.get('state') as string

  const app = new OAuthApp({
    clientType: 'github-app',
    clientId,
    clientSecret,
  })

  const { authentication } = await app.createToken({
    code,
  })

  console.log('token=========authentication:', userId, authentication)

  await prisma.user.update({
    where: { id: userId },
    data: {
      github: {
        token: authentication.token,
        refreshToken: (authentication as any).refreshToken,
        tokenExpiresAt: (authentication as any).expiresAt,
        refreshTokenExpiresAt: (authentication as any).refreshTokenExpiresAt,
      },
    },
  })

  return NextResponse.redirect(new URL('/~/settings/backup', req.url))
}

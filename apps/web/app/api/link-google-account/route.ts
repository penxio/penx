import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@penx/db'
import { ProviderType } from '@penx/db/client'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const access_token = url.searchParams.get('access_token')
  const refresh_token = url.searchParams.get('refresh_token')
  const expiry_date = url.searchParams.get('expiry_date')
  const userId = url.searchParams.get('uid')
  const name = url.searchParams.get('name')
  const openid = url.searchParams.get('openid')
  const picture = url.searchParams.get('picture')
  const email = url.searchParams.get('email')

  if (!access_token || !expiry_date || !userId) {
    return NextResponse.redirect(
      new URL('/~/settings/link-accounts?error=link-fail', req.url),
    )
  }

  const account = await prisma.account.findUnique({
    where: { providerAccountId: openid! },
  })

  console.log('=======account:', account)

  if (account) {
    return NextResponse.redirect(
      new URL(
        `/~/settings/link-accounts?error=account-linked&openid=${openid}`,
        req.url,
      ),
    )
  }
  await prisma.account.create({
    data: {
      userId,
      providerType: ProviderType.GOOGLE,
      providerAccountId: openid!,
      refreshToken: refresh_token,
      accessToken: access_token,
      expiresAt: new Date(expiry_date).valueOf(),
      providerInfo: {
        name,
        picture,
        email,
      },
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: {
      email,
      name,
      image: picture,
      google: {
        name,
        email,
        picture,
        access_token,
        refresh_token,
        expiry_date,
      },
    },
  })

  return NextResponse.redirect(new URL('/~/settings/link-accounts', req.url))
}

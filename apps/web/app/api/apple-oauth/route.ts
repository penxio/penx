import { generateAppleClientSecret } from '@/lib/generateAppleClientSecret'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import qs from 'query-string'
import { APPLE_OAUTH_REDIRECT_URI } from '@penx/constants'
import { decodeAppleToken } from '@penx/libs/decodeAppleToken'

type AppleTokenData = {
  access_token: string
  token_type: string
  expires_in: string
  refresh_token: string
  id_token: string
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const data: { [key: string]: string } = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    const { code, state, error } = data

    const clientSecret = generateAppleClientSecret()

    const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: APPLE_OAUTH_REDIRECT_URI,
      }),
    })

    const tokenData: AppleTokenData = await tokenResponse.json()

    const [host, pathname = '', uid, qsData] = state.split('__')
    const userId = uid.replace(/^uid/, '')

    const url = new URL(`${host}${pathname}`)
    url.searchParams.set('state', state)
    url.searchParams.set('auth_type', 'apple')
    url.searchParams.set('access_token', tokenData.access_token)
    url.searchParams.set('refresh_token', tokenData.refresh_token)
    url.searchParams.set('expiry_date', tokenData.expires_in)
    url.searchParams.set('id_token', tokenData.id_token)
    url.searchParams.set('userId', userId)
    url.searchParams.set('qs', qsData)

    return NextResponse.redirect(url, 302)
  } catch (error) {
    return NextResponse.json({
      error,
    })
  }
}

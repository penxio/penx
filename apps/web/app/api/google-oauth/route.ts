import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import qs from 'query-string'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state') || ''
  const [host, pathname = '', qsData] = state.split('__')

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/google-oauth`

  if (!code || !host) {
    return NextResponse.redirect('/error') // Handle error accordingly
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  const { tokens } = await auth.getToken(code)

  return NextResponse.redirect(
    `${host}${pathname}?auth_type=google&access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&expiry_date=${tokens.expiry_date}&qs=${qsData}`,
  )
}

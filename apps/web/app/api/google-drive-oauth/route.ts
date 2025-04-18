import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state') as string

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/google-drive-oauth`

  // console.log('=======state:', state, 'redirectUri:', redirectUri)

  if (!code || !state) {
    return NextResponse.redirect('/error') // Handle error accordingly
  }

  const [host, uid] = state.split('____')

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  const { tokens } = await auth.getToken(code)

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  })

  const userInfo = await oauth2.userinfo.get()

  console.log('User Profile:', userInfo.data)

  return NextResponse.redirect(
    `${host}/api/google-drive-oauth?uid=${uid}&access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&expiry_date=${tokens.expiry_date}&email=${userInfo.data.email}&name=${userInfo.data.name}&picture=${userInfo.data.picture}`,
  )
}

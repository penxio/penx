import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@penx/db'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

type TokenInfo = {
  access_token: string
  refresh_token: string
  scope: string
  token_type: string
  id_token: string
  expiry_date: number
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const refresh_token = url.searchParams.get('refresh_token')

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials({
    refresh_token,
  })
  try {
    const accessToken = await oauth2Client.getAccessToken()

    return NextResponse.json(accessToken.res?.data)
  } catch (error) {
    throw new Error('Failed to refresh access token')
  }
}

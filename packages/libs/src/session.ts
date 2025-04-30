
import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { SessionData } from '@penx/types'

export function getSessionOptions() {
  const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: 'penx_session',
    cookieOptions: {
      // secure only works in `https` environments
      // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
      secure: true,
    },
  }
  return sessionOptions
}

export async function getServerSession() {
  const sessionOptions = getSessionOptions()
  const session = (await getIronSession(
    await cookies(),
    sessionOptions,
  )) as SessionData

  return session
}

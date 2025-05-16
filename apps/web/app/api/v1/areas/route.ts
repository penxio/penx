import { slug } from 'github-slugger'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { prisma } from '@penx/db'
import { getSessionOptions } from '@penx/libs/session'
import { SessionData } from '@penx/types'

export async function GET(req: Request) {
  const url = new URL(req.url)
  // const siteId = url.searchParams.get('siteId') as string

  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )

  if (!session?.isLoggedIn) {
    throw new Error('Unauthorized')
  }

  const tags = await prisma.area.findMany({
    where: { siteId: session.siteId },
  })
  return Response.json(tags)
}

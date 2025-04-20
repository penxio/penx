import { prisma } from '@penx/db'
import { getSessionOptions } from '@/lib/session'
import { SessionData } from '@penx/types'
import { slug } from 'github-slugger'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

interface AddTagInput {
  siteId: string
  name: string
}

export async function POST(req: NextRequest) {
  const input = (await req.json()) as AddTagInput
  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )

  if (!session?.isLoggedIn) {
    throw new Error('Unauthorized')
  }

  const tagName = slug(input.name)
  let tag = await prisma.tag.findFirst({
    where: { name: tagName, siteId: input.siteId },
  })

  if (tag) {
    throw new Error('Tag already exists')
  }

  const newTag = await prisma.tag.create({
    data: {
      siteId: input.siteId,
      name: tagName,
      userId: session.userId,
    },
  })

  return Response.json(newTag)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const siteId = url.searchParams.get('siteId') as string

  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )

  if (!session?.isLoggedIn) {
    throw new Error('Unauthorized')
  }

  const tags = await prisma.tag.findMany({
    where: { siteId },
  })
  return Response.json(tags)
}

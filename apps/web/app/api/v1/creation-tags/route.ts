import { getSessionOptions } from '@/lib/session'
import { SessionData } from '@penx/types'
import {
  addCreationTag,
  AddCreationTagInput,
} from '@penx/api/lib/addCreationTag'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const input = (await req.json()) as AddCreationTagInput
  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )

  if (!session?.isLoggedIn) {
    throw new Error('Unauthorized')
  }
  const postTag = await addCreationTag(input)

  return Response.json(postTag)
}

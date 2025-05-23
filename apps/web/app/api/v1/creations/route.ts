import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { AddCreationInput, defaultEditorContent } from '@penx/constants'
import { prisma } from '@penx/db'
import { getSessionOptions } from '@penx/libs/session'
import { StructType, SessionData } from '@penx/types'

export async function POST(req: NextRequest) {
  const json = (await req.json()) as AddCreationInput
  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )

  if (!session?.isLoggedIn) {
    throw new Error('Unauthorized')
  }

  const getContent = () => {
    if (json.type === StructType.NOTE) {
      const content = json.content.split('\n')
      const slateValue = content.map((line) => ({
        type: 'p',
        children: [{ text: line }],
      }))
      return JSON.stringify(slateValue)
    }

    return JSON.stringify(defaultEditorContent)
  }

  const siteId = session.siteId
  const { type, ...rest } = json

  const struct = await prisma.struct.findUniqueOrThrow({
    where: {
      siteId_type: { siteId, type },
    },
  })

  // console.log('=========value:', value)
  return Response.json({})
}

export async function PATCH(request: NextRequest) {}

// read session
export async function GET() {
  //
}

// logout
export async function DELETE() {
  //
}

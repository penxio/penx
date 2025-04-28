import { getSessionOptions } from '@penx/libs/session'
import { SessionData } from '@penx/types'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createCreation } from '@penx/api/createCreation'
import { CreateCreationInput, editorDefaultValue } from '@penx/constants'
import { prisma } from '@penx/db'
import { CreationType } from '@penx/types'

interface AddCreationInput {
  type: string
  title: string
  description: string
  content: string
  areaId: string
  published: boolean
}

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
    if (json.type === CreationType.NOTE) {
      const content = json.content.split('\n')
      const slateValue = content.map((line) => ({
        type: 'p',
        children: [{ text: line }],
      }))
      return JSON.stringify(slateValue)
    }

    return JSON.stringify(editorDefaultValue)
  }

  const siteId = session.siteId
  const { type, ...rest } = json

  const mold = await prisma.mold.findUniqueOrThrow({
    where: {
      siteId_type: { siteId, type },
    },
  })

  const creation = await createCreation(siteId, session.uid, false, {
    ...rest,
    type: mold.type,
    siteId,
    moldId: mold.id,
    content: getContent(),
  } as CreateCreationInput)

  // console.log('=========value:', value)
  return Response.json(creation)
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

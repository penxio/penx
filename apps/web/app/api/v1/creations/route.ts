import { editorDefaultValue } from '@/lib/constants'
import { CreateCreationInput } from '@/lib/constants/schema.constants'
import { prisma } from '@penx/db'
import { getSessionOptions } from '@/lib/session'
import { CreationType } from '@/lib/theme.types'
import { SessionData } from '@/lib/types'
import { createCreation } from '@/server/lib/createCreation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

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

import { getIronSession } from 'iron-session'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@penx/db'
import { getSessionOptions } from '@penx/libs/session'
import { OperationType } from '@penx/model-type'
import { SessionData } from '@penx/types'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function GET(req: Request) {
  return Response.json(
    { ok: true, hello: 'world' },
    {
      headers: { ...headers, 'Content-Type': 'application/json' },
    },
  )
}

interface SyncInput {
  operation: string
  siteId: string
  key: string
  data: any
}

export async function POST(req: NextRequest) {
  const input = (await req.json()) as SyncInput
  const session = await getIronSession<SessionData>(
    await cookies(),
    getSessionOptions(),
  )

  let siteId = session?.siteId || ''

  if (!session?.isLoggedIn) {
    let authorization = req.headers.get('authorization')
    if (authorization) {
      try {
        const decoded = jwt.verify(
          authorization,
          process.env.NEXTAUTH_SECRET!,
        ) as any
        siteId = decoded.siteId
      } catch (error) {
        throw new Error('Unauthorized')
      }
    } else {
      throw new Error('Unauthorized')
    }
  }

  if (input.siteId !== siteId) {
    throw new Error('Invalid site ID')
  }

  if (input.operation === OperationType.CREATE) {
    await prisma.node.create({
      data: input.data,
    })
  } else if (input.operation === OperationType.UPDATE) {
    const { updatedAt, ...props } = input.data
    const node = await prisma.node.findUnique({ where: { id: input.key } })
    if (node) {
      const updatedProps = {
        ...(node.props as any),
        ...props,
      }
      if (updatedAt) updatedProps.updatedAt = new Date(updatedAt)
      await prisma.node.update({
        where: { id: input.key },
        data: { props: updatedProps },
      })
    }
  } else if (input.operation === OperationType.DELETE) {
    // if (input.table === 'area') {
    //   await prisma.$transaction(
    //     async (tx) => {
    //       const creations = await tx.creation.findMany({
    //         where: { areaId: input.key },
    //       })
    //       await tx.creationTag.deleteMany({
    //         where: {
    //           creationId: { in: creations.map((c) => c.id) },
    //         },
    //       })
    //       await tx.creation.deleteMany({ where: { areaId: input.key } })
    //       await tx.area.delete({ where: { id: input.key } })
    //     },
    //     {
    //       maxWait: 10000, // default: 2000
    //       timeout: 20000, // default: 5000
    //     },
    //   )
    // }

    await prisma.node.delete({
      where: { id: input.key },
    })
    return Response.json(
      { ok: true },
      {
        headers: { ...headers, 'Content-Type': 'application/json' },
      },
    )
  }

  return Response.json(
    { ok: true },
    {
      headers: { ...headers, 'Content-Type': 'application/json' },
    },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

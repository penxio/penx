import { prisma } from '@penx/db'
import { CID } from 'multiformats/cid'
import { NextRequest, NextResponse } from 'next/server'

// export const runtime = 'edge'

interface Input {
  name: string
  description: string
}

export async function POST(req: Request) {
  const input = await req.json()

  try {
    const cid = input.cid as string
    const item = await prisma.cid.findUnique({ where: { original: cid } })

    if (!item) {
      await prisma.cid.create({
        data: { original: cid, lowercase: cid.toLowerCase() },
      })
    }

    return NextResponse.json({
      ok: true,
    })
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      message: error?.message,
      error: error,
    })
  }
}

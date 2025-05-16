import { CID } from 'multiformats/cid'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@penx/db'

function isValidCID(cidString: string) {
  try {
    CID.parse(cidString)
    return true
  } catch (error) {
    return false
  }
}

// export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const isCID = isValidCID(json?.cid)

  if (!isCID) {
    return NextResponse.json({ ok: false })
  }

  const cid = json.cid as string
  const item = await prisma.cid.findUnique({ where: { original: cid } })

  if (!item) {
    await prisma.cid.create({
      data: { original: cid, lowercase: cid.toLowerCase() },
    })
  }

  return NextResponse.json({
    ok: true,
  })
}

export async function GET(req: NextRequest) {
  const lowercaseCID = req.nextUrl.searchParams.get('cid') as string

  const item = await prisma.cid.findUniqueOrThrow({
    where: { lowercase: lowercaseCID },
  })

  return NextResponse.json({
    cid: item.original,
    ok: true,
  })
}

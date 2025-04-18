import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const host = url.searchParams.get('host') || ''
  const pathname = url.searchParams.get('pathname') || ''
  return NextResponse.redirect(
    `${url.protocol}//${host}${decodeURIComponent(pathname)}`,
  )
}

import { IPFS_GATEWAY } from '@/lib/constants'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const cid = url.searchParams.get('cid')
  const imageURL = IPFS_GATEWAY + '/ipfs/' + cid

  const response = await fetch(imageURL)

  if (!response.ok) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }

  // Create a new response with the image data
  const imageBlob = await response.blob()

  return new NextResponse(imageBlob, {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}

import { IPFS_GATEWAY } from '@penx/constants'
import ky from 'ky'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const hash = url.searchParams.get('cid')
  const spaceURI = IPFS_GATEWAY + '/ipfs/' + hash
  const res = await ky.get(spaceURI).json<{ logo: string }>()

  if (!res.logo) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }

  const imageURL = IPFS_GATEWAY + '/ipfs/' + res.logo

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

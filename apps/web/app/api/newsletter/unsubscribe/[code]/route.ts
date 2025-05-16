import { NextResponse } from 'next/server'
import { prisma } from '@penx/db'
import { SubscriberStatus } from '@penx/db/client'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const unsubscribeCode = (await params).code

    const subscriber = await prisma.subscriber.findFirst({
      where: { unsubscribeCode },
      select: { id: true, email: true, site: true },
    })

    if (!subscriber) {
      return new NextResponse(null, { status: 200 })
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: SubscriberStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
      },
    })

    const successUrl = new URL(request.url)
    successUrl.pathname = '/newsletter/unsubscribed'
    successUrl.search = `?email=${encodeURIComponent(subscriber.email || '')}`

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

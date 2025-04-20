import { prisma } from '@penx/db'
import { SubscriberStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const confirmationCode = (await params).code

    // Find subscriber with this confirmation code
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        confirmationCode,
        status: SubscriberStatus.PENDING,
      },
      select: {
        id: true,
        email: true,
        metadata: true,
        site: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!subscriber) {
      return new NextResponse('Invalid or expired confirmation link', {
        status: 400,
      })
    }

    // Check if confirmation link has expired
    const metadata = subscriber.metadata as Record<string, any>
    const expireAt = metadata?.confirmExpireAt
      ? new Date(metadata.confirmExpireAt)
      : null

    if (!expireAt || expireAt <= new Date()) {
      return new NextResponse('Confirmation link has expired', { status: 400 })
    }

    // Update subscriber status
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: SubscriberStatus.ACTIVE,
        confirmedAt: new Date(),
      },
    })

    // Redirect to success page
    const successUrl = new URL(request.url)
    successUrl.pathname = '/newsletter/confirmed'
    successUrl.search = `?email=${encodeURIComponent(
      subscriber.email || '',
    )}&site=${encodeURIComponent(subscriber.site?.name || '')}`

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('Error confirming subscription:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

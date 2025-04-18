import { cacheHelper } from '@/lib/cache-header'
import { prisma } from '@penx/db'
import { Balance } from '@/lib/types'
import { getOAuthStripe } from '@/server/lib/getOAuthStripe'
import { InvoiceType, OrderStatus, PaymentStatus } from '@penx/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const sessionId = url.searchParams.get('session_id')
  const userId = url.searchParams.get('userId') || ''
  const campaignId = url.searchParams.get('campaignId') || ''
  const host = url.searchParams.get('host') || ''
  const pathname = url.searchParams.get('pathname') || ''
  const amount = url.searchParams.get('amount') || ''

  console.log('url========>>:', url)

  if (!sessionId) {
    throw new Error('Invalid sessionId.')
  }

  try {
    let siteId = url.searchParams.get('siteId') || url.pathname.split('/')[2]

    const site = await prisma.site.findUniqueOrThrow({
      where: { id: siteId },
    })

    const stripe = await getOAuthStripe(site)

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    })

    console.log('=======session:', session)

    if (!session.id) {
      throw new Error('Invalid session.')
    }

    console.log('========.invoice:', session.invoice)

    const productAmount = Number(amount)
    const paidAmount = productAmount * 100
    await prisma.pledge.create({
      data: {
        paidAmount,
        status: OrderStatus.PENDING,
        userId,
        siteId,
        campaignId,
        customer: session.customer as any,
      },
    })

    const invoice = await stripe.invoices.retrieve(session.invoice as string)

    console.log('========invoice:', invoice)

    await prisma.invoice.create({
      data: {
        siteId,
        userId,
        campaignId,
        type: InvoiceType.CAMPAIGN,
        amount: paidAmount,
        currency: invoice.currency,
        stripeInvoiceId: invoice.id,
        stripeInvoiceNumber: invoice.number,
        stripePeriodStart: invoice.period_start,
        stripePeriodEnd: invoice.period_end,
      },
    })

    const campaign = await prisma.campaign.findUniqueOrThrow({
      where: { id: campaignId },
    })

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        currentAmount: campaign.currentAmount + paidAmount,
        backerCount: campaign.backerCount + 1,
      },
    })

    return NextResponse.redirect(
      `${url.protocol}//${host}${decodeURIComponent(pathname)}`,
    )
  } catch (error) {
    console.error('Error handling successful checkout:', error)
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

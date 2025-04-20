import { cacheHelper } from '@penx/libs/cache-header'
import { prisma } from '@penx/db'
import { Balance } from '@/lib/types'
import { getOAuthStripe } from '@penx/api/lib/getOAuthStripe'
import { InvoiceType, OrderStatus, PaymentStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const sessionId = url.searchParams.get('session_id')
  const userId = url.searchParams.get('userId') || ''
  const productId = url.searchParams.get('productId') || ''
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

    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
    })

    console.log('========.invoice:', session.invoice)

    const productAmount = Number(amount)
    const paidAmount = product.price * productAmount
    await prisma.order.create({
      data: {
        productAmount,
        paidAmount,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PAID,
        userId,
        siteId,
        productId,
        customer: session.customer! as any,
      },
    })

    let balance = site.balance as Balance
    if (!balance) {
      balance = {
        withdrawable: 0,
        withdrawing: 0,
        locked: 0,
      }
    }

    balance.withdrawable += paidAmount

    const invoice = await stripe.invoices.retrieve(session.invoice as string)

    console.log('========invoice:', invoice)

    await prisma.invoice.create({
      data: {
        siteId,
        userId,
        amount: paidAmount,
        productId,
        type: InvoiceType.PRODUCT,
        currency: invoice.currency,
        stripeInvoiceId: invoice.id,
        stripeInvoiceNumber: invoice.number,
        stripePeriodStart: invoice.period_start,
        stripePeriodEnd: invoice.period_end,
      },
    })

    await prisma.site.update({
      where: { id: siteId },
      data: {
        balance,
      },
    })

    await cacheHelper.updateMySites(site.userId, null)

    return NextResponse.redirect(
      `${url.protocol}//${host}${decodeURIComponent(pathname)}`,
    )
  } catch (error) {
    console.error('Error handling successful checkout:', error)
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

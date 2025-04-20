import { stripe } from '@penx/libs/stripe'
import { BillingCycle, PlanType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { handleEvent } from './handleEvent'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('Stripe-Signature')!
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    await handleEvent(event)

    console.log('✅ Handled Stripe Event', event.type)
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.log(`❌ Error when handling Stripe Event: ${message}`)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

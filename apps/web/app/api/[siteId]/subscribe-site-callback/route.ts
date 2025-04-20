import { prisma } from '@penx/db'
import { getServerSession, getSessionOptions } from '@/lib/session'
import { SessionData } from '@penx/types'
import { getOAuthStripe } from '@penx/api/lib/getOAuthStripe'
import { BillingCycle, PlanType, StripeType } from '@prisma/client'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const millisecondsPerMonth = 30 * 24 * 60 * 60 * 1000
const millisecondsPerYear = 12 * 30 * 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const sessionId = url.searchParams.get('session_id')
  const userId = url.searchParams.get('userId') || ''
  const penxProductId = url.searchParams.get('productId') || ''
  const host = url.searchParams.get('host') || ''
  const pathname = url.searchParams.get('pathname') || ''
  const prevSubscriptionId = url.searchParams.get('prevSubscriptionId') || ''

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

    // const account = await stripe.accounts.retrieve(
    //   stripeOAuthToken.stripe_user_id!,
    // )

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    })

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.')
    }

    const customerId = session.customer.id

    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.')
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    })

    // console.log('========>>>>subscription:', subscription)

    const plan = subscription.items.data[0]?.price

    // console.log('==========>>>>plan:', plan)

    if (!plan) {
      throw new Error('No plan found for this subscription.')
    }

    const productId = (plan.product as Stripe.Product).id

    if (!productId) {
      throw new Error('No product ID found for this subscription.')
    }

    siteId = session.client_reference_id!

    if (!siteId) {
      throw new Error("No site ID found in session's client_reference_id.")
    }

    const dbSubscription = await prisma.subscription.findFirst({
      where: { siteId, userId },
    })

    console.log('======111=dbSubscription:', dbSubscription)

    if (prevSubscriptionId) {
      try {
        const canceledSubscription =
          await stripe.subscriptions.cancel(prevSubscriptionId)

        console.log('=======>>>>canceledSubscription:', canceledSubscription)
      } catch (error) {}
    }

    if (dbSubscription) {
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          productId: penxProductId,
          sassCustomerId: customerId,
          sassSubscriptionId: subscriptionId,
          sassSubscriptionStatus: subscription.status,
          // TODO:
          // sassCurrentPeriodEnd: new Date(
          //   subscription.current_period_end * 1000,
          // ),
          sassBillingCycle: BillingCycle.MONTHLY,
          sassProductId: productId,
        },
      })
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          siteId,
          productId: penxProductId,
          sassCustomerId: customerId,
          sassSubscriptionId: subscriptionId,
          sassSubscriptionStatus: subscription.status,
          // sassCurrentPeriodEnd: new Date(
          //   subscription.current_period_end * 1000,
          // ),
          sassBillingCycle: BillingCycle.MONTHLY,
          sassProductId: productId,
        },
      })
    }

    /** auth session */
    {
      const sessionOptions = getSessionOptions()
      const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions,
      )

      // session.planType = planType
      // session.subscriptionStatus = 'active'
      // session.billingCycle = billingCycle

      // session.currentPeriodEnd = new Date(
      //   Date.now() +
      //     (billingCycle === BillingCycle.MONTHLY
      //       ? millisecondsPerMonth
      //       : millisecondsPerYear),
      // ).toISOString()

      await session.save()
    }

    return NextResponse.redirect(
      `${url.protocol}//${host}${decodeURIComponent(pathname)}`,
    )
  } catch (error) {
    console.error('Error handling successful checkout:', error)
    return NextResponse.redirect(new URL('/error', req.url))
  }
}

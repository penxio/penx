import type { Stripe } from 'stripe'
import { getOAuthStripe } from '@penx/api/lib/getOAuthStripe'
import { prisma } from '@penx/db'
import { BillingCycle, InvoiceType } from '@penx/db/client'
import { cacheHelper } from '@penx/libs/cache-header'

export async function handleEvent(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session

  if (session?.mode === 'payment') return

  if (event.type === 'checkout.session.completed') {
    //
  }

  if (event.type === 'invoice.payment_succeeded') {
    // console.log('connected event==========>>>:', event)

    console.log(
      '========.subscription detail:',
      (session as any)?.subscription_details,
    )
    const metaSiteId = (session as any).subscription_details.metadata.siteId

    const stripe = await getOAuthStripe(metaSiteId)

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    )

    console.log('=======subscription:', subscription)

    if (!subscription?.id) return

    const siteId = subscription.metadata.siteId
    const userId = subscription.metadata.userId
    const productId = subscription.metadata.productId

    const subscriptionTarget = subscription.metadata.subscriptionTarget

    console.log('========SubscriptionTarget:', subscriptionTarget)

    await prisma.$transaction(
      async (tx) => {
        const dbSubscription = await tx.subscription.findFirst({
          where: { siteId, userId },
        })

        if (dbSubscription) {
          await tx.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              sassCurrentPeriodEnd: new Date(
                subscription.current_period_start * 1000,
              ),
              sassCustomerId: subscription.customer.toString(),
              sassSubscriptionId: subscription.id,
              sassSubscriptionStatus: subscription.status,
              sassProductId: productId,
            },
          })
        } else {
          await tx.subscription.create({
            data: {
              userId,
              siteId,
              productId,
              sassCustomerId: subscription.customer.toString(),
              sassSubscriptionId: subscription.id,
              sassSubscriptionStatus: subscription.status,
              sassCurrentPeriodEnd: new Date(
                subscription.current_period_start * 1000,
              ),
              sassBillingCycle: BillingCycle.MONTHLY,
              sassProductId: productId,
            },
          })
        }

        await tx.invoice.create({
          data: {
            siteId,
            productId,
            userId,
            type: InvoiceType.SITE_SUBSCRIPTION,
            amount: event.data.object.amount_paid,
            currency: event.data.object.currency,
            stripeInvoiceId: event.data.object.id,
            stripeInvoiceNumber: event.data.object.number,
            stripePeriodStart: event.data.object.period_start,
            stripePeriodEnd: event.data.object.period_end,
          },
        })
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    )
  }
  if (event.type === 'customer.subscription.updated') {
    //add customer logic
    console.log('event.type: ', event.type)
  }
  console.log('✅ Stripe Webhook Processed')
}

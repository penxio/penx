import { BillingCycle, PlanType } from '@prisma/client'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import qs from 'query-string'
import queryString from 'query-string'
import { z } from 'zod'
import {
  STRIPE_BASIC_MONTHLY_PRICE_ID,
  STRIPE_BASIC_YEARLY_PRICE_ID,
  STRIPE_BELIEVER_PRICE_ID,
  STRIPE_PRO_MONTHLY_PRICE_ID,
  STRIPE_PRO_YEARLY_PRICE_ID,
  STRIPE_STANDARD_MONTHLY_PRICE_ID,
  STRIPE_STANDARD_YEARLY_PRICE_ID,
  STRIPE_TEAM_MONTHLY_PRICE_ID,
  STRIPE_TEAM_YEARLY_PRICE_ID,
  SubscriptionTarget,
} from '@penx/constants'
import { prisma } from '@penx/db'
import { getServerSession, getSessionOptions } from '@penx/libs/session'
import { stripe } from '@penx/libs/stripe'
import { SessionData } from '@penx/types'
import { protectedProcedure, router } from '../trpc'

export const billingRouter = router({
  checkout: protectedProcedure
    .input(
      z.object({
        planType: z.nativeEnum(PlanType),
        billingCycle: z.nativeEnum(BillingCycle),
        host: z.string(),
        pathname: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isBeliever = input.planType === PlanType.BELIEVER
      const site = await prisma.site.findUniqueOrThrow({
        where: { id: ctx.activeSiteId },
      })

      const getProductId = () => {
        if (isBeliever) return STRIPE_BELIEVER_PRICE_ID

        if (input.planType === PlanType.PRO) {
          return input.billingCycle === BillingCycle.MONTHLY
            ? STRIPE_PRO_MONTHLY_PRICE_ID
            : STRIPE_PRO_YEARLY_PRICE_ID
        }

        if (input.planType === PlanType.STANDARD) {
          return input.billingCycle === BillingCycle.MONTHLY
            ? STRIPE_STANDARD_MONTHLY_PRICE_ID
            : STRIPE_STANDARD_YEARLY_PRICE_ID
        }

        return input.billingCycle === BillingCycle.MONTHLY
          ? STRIPE_BASIC_MONTHLY_PRICE_ID
          : STRIPE_BASIC_YEARLY_PRICE_ID
      }

      const success_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${ctx.activeSiteId}/payment-callback`
      const cancel_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${ctx.activeSiteId}/checkout-cancel-callback`

      console.log('=====>>>success_url:', success_url)
      const userId = ctx.token.uid

      const cancelQuery = {
        host: input.host,
        pathname: input.pathname,
      }

      const successQuery = {
        ...cancelQuery,
        billingCycle: input.billingCycle,
        planType: input.planType,
        // siteId: ctx.activeSiteId,
        prevSubscriptionId: site.sassSubscriptionId,
      }

      const session = await stripe.checkout.sessions.create({
        // mode: 'subscription',
        mode: isBeliever ? 'payment' : 'subscription',
        payment_method_types: ['card'],
        customer_email: ctx.token.email || '',
        allow_promotion_codes: true,
        client_reference_id: ctx.activeSiteId,
        subscription_data: isBeliever
          ? undefined
          : {
              // trial_period_days: 7,
              metadata: {
                siteId: ctx.activeSiteId,
                billingCycle: input.billingCycle,
                planType: input.planType,
                subscriptionTarget: SubscriptionTarget.PENX,
              },
            },
        success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&${qs.stringify(successQuery)}`,
        cancel_url: `${cancel_url}?${qs.stringify(cancelQuery)}`,
        line_items: [{ price: getProductId(), quantity: 1 }],
      })

      if (!session.url) return { success: false as const }

      return { success: true, url: session.url }
    }),

  cancel: protectedProcedure.mutation(async ({ ctx, input }) => {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: ctx.activeSiteId },
    })

    const subscriptionId = site.sassSubscriptionId as string

    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      console.log('=========>>>>>>subscription:', subscription)

      console.log(`Subscription ${subscriptionId} cancelled successfully.`)

      const sassCurrentPeriodEnd = new Date(
        subscription.current_period_end * 1000,
      )

      await prisma.site.update({
        where: { id: ctx.activeSiteId },
        data: {
          // sassPlanType: PlanType.FREE,
          // sassProductId: null,
          // sassSubscriptionStatus: 'canceled',
          sassSubscriptionStatus: subscription.status,
          sassCurrentPeriodEnd: sassCurrentPeriodEnd,
          // sassSubscriptionId: null,
        },
      })

      const sessionOptions = getSessionOptions()
      const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions,
      )

      session.subscriptionStatus = 'canceled'
      session.currentPeriodEnd = sassCurrentPeriodEnd.toISOString()

      await session.save()

      return true
    } catch (err) {
      console.error(`Error cancelling subscription: ${err}`)
      return false
    }
  }),
})

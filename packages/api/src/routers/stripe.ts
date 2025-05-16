import qs from 'query-string'
import Stripe from 'stripe'
import { z } from 'zod'
import { SubscriptionTarget } from '@penx/constants'
import { prisma } from '@penx/db'
import { StripeType } from '@penx/db/client'
import { stripe } from '@penx/libs/stripe'
import { Balance, StripeInfo } from '@penx/types'
import { getOAuthStripe } from '../lib/getOAuthStripe'
import { protectedProcedure, router } from '../trpc'

export const stripeRouter = router({
  authInfo: protectedProcedure.query(async ({ ctx, input }) => {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: ctx.activeSiteId },
    })

    let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

    if (!stripeOAuthToken?.access_token) {
      return {
        token: null,
        account: null,
      }
    }

    try {
      const oauthStripe = new Stripe(stripeOAuthToken.access_token!, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      })

      const account = await oauthStripe.accounts.retrieve(
        stripeOAuthToken.stripe_user_id!,
      )

      return {
        token: stripeOAuthToken,
        account,
      }
    } catch (error) {
      const newToken = await stripe.oauth.token({
        grant_type: 'refresh_token',
        refresh_token: stripeOAuthToken.refresh_token!,
      })

      await prisma.site.update({
        where: { id: ctx.activeSiteId },
        data: {
          stripeOAuthToken: newToken as any,
        },
      })

      const oauthStripe = new Stripe(newToken.access_token!, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      })

      const account = await oauthStripe.accounts.retrieve(
        stripeOAuthToken.stripe_user_id!,
      )

      return {
        token: newToken,
        account,
      }
    }
  }),

  subscribeSiteCheckout: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        priceId: z.string(),
        siteId: z.string(),
        host: z.string(),
        pathname: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = input.siteId
      const success_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${siteId}/subscribe-site-callback`
      const cancel_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${siteId}/checkout-cancel-callback`

      console.log('=====>>>success_url:', success_url)
      const userId = ctx.token.uid

      const subscription = await prisma.subscription.findFirst({
        where: { userId, siteId },
      })

      const cancelQuery = {
        host: input.host,
        pathname: input.pathname,
      }

      const successQuery = {
        siteId,
        userId,
        productId: input.productId,
        host: input.host,
        pathname: input.pathname,
        prevSubscriptionId: subscription?.sassSubscriptionId || '',
      }

      // console.log('=======query:', successQuery)

      const oauthStripe = await getOAuthStripe(siteId)
      const session = await oauthStripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: ctx.token.email || '',
        client_reference_id: siteId,
        subscription_data: {
          metadata: {
            siteId,
            userId,
            priceId: input.priceId,
            productId: input.productId,
            subscriptionTarget: SubscriptionTarget.SITE,
            prevSubscriptionId: subscription?.sassSubscriptionId || '',
          },
        },
        success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&${qs.stringify(successQuery)}`,
        cancel_url: `${cancel_url}?${qs.stringify(cancelQuery)}`,
        line_items: [{ price: input.priceId, quantity: 1 }],
      })

      if (!session.url) return { success: false as const }

      return { success: true, url: session.url }
    }),

  buyProductCheckout: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        siteId: z.string(),
        host: z.string(),
        pathname: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = input.siteId
      const success_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${siteId}/buy-product-callback`
      const cancel_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${siteId}/checkout-cancel-callback`

      const product = await prisma.product.findUniqueOrThrow({
        where: { id: input.productId },
      })
      const stripeInfo = product.stripe as StripeInfo
      const priceId = stripeInfo.priceId as string

      console.log('=====>>>success_url:', success_url)
      const userId = ctx.token.uid

      const cancelQuery = {
        host: input.host,
        pathname: input.pathname,
      }

      const successQuery = {
        ...cancelQuery,
        siteId,
        userId,
        productId: input.productId,
        amount: input.amount,
      }

      const oauthStripe = await getOAuthStripe(siteId)
      const session = await oauthStripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: ctx.token.email || '',
        // customer_email: email,
        client_reference_id: siteId,
        success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&${qs.stringify(successQuery)}`,
        cancel_url: `${cancel_url}?${qs.stringify(cancelQuery)}`,
        line_items: [{ price: priceId, quantity: input.amount }],
        invoice_creation: {
          enabled: true,
        },
      })

      if (!session.url) return { success: false as const }

      return { success: true, url: session.url as string }
    }),

  buyCampaignCheckout: protectedProcedure
    .input(
      z.object({
        campaignId: z.string(),
        siteId: z.string(),
        host: z.string(),
        pathname: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = input.siteId
      const success_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${siteId}/buy-campaign-callback`
      const cancel_url = `${process.env.NEXT_PUBLIC_ROOT_HOST}/api/${siteId}/checkout-cancel-callback`

      const campaign = await prisma.campaign.findUniqueOrThrow({
        where: { id: input.campaignId },
      })
      const priceId = campaign.stripePriceId as string

      console.log('=====>>>success_url:', success_url)
      const userId = ctx.token.uid

      const cancelQuery = {
        host: input.host,
        pathname: input.pathname,
      }

      const successQuery = {
        ...cancelQuery,
        siteId,
        userId,
        campaignId: input.campaignId,
        amount: input.amount,
      }

      const oauthStripe = await getOAuthStripe(siteId)
      const session = await oauthStripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: ctx.token.email || '',
        // customer_email: email,
        client_reference_id: siteId,
        success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&${qs.stringify(successQuery)}`,
        cancel_url: `${cancel_url}?${qs.stringify(cancelQuery)}`,
        line_items: [{ price: priceId, quantity: input.amount }],
        invoice_creation: {
          enabled: true,
        },
      })

      if (!session.url) return { success: false, url: '' }

      return { success: true, url: session.url }
    }),

  cancelSubscription: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const site = await prisma.site.findUniqueOrThrow({
        where: { id: siteId },
      })

      let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

      const apiKey =
        site.stripeType === StripeType.PLATFORM
          ? process.env.STRIPE_API_KEY!
          : stripeOAuthToken.access_token!

      const oauthStripe = new Stripe(apiKey, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      })

      const { sassSubscriptionId, id } =
        await prisma.subscription.findFirstOrThrow({
          where: {
            siteId: input.siteId,
            userId: ctx.token.uid,
          },
        })

      const subscription = await oauthStripe.subscriptions.cancel(
        sassSubscriptionId!,
      )

      const sassCurrentPeriodEnd = new Date(
        subscription.current_period_end * 1000,
      )

      await prisma.subscription.update({
        where: { id },
        data: {
          sassSubscriptionStatus: subscription.status,
          sassCurrentPeriodEnd: sassCurrentPeriodEnd,
        },
      })

      return true
    }),
})

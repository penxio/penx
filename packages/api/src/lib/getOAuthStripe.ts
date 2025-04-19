import { stripe } from '@/lib/stripe'
import { prisma } from '@penx/db'
import { Site, StripeType } from '@penx/db/client'
import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'

export async function getOAuthStripe(siteOrId: string | Site) {
  let site: Site = siteOrId as Site
  if (typeof siteOrId === 'string') {
    site = await prisma.site.findUniqueOrThrow({
      where: { id: siteOrId },
    })
  }

  // console.log('======site:', site, site.stripeType, site.stripeOAuthToken)

  if (site.stripeType === StripeType.PLATFORM) {
    return stripe
  }

  let stripeOAuthToken = site.stripeOAuthToken as Stripe.OAuthToken

  if (!stripeOAuthToken) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Please setup your membership firstly.',
    })
  }

  try {
    const oauthStripe = new Stripe(stripeOAuthToken.access_token!, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })

    await oauthStripe.accounts.retrieve(stripeOAuthToken.stripe_user_id!)
    return oauthStripe
  } catch (error) {
    const newToken = await stripe.oauth.token({
      grant_type: 'refresh_token',
      refresh_token: stripeOAuthToken.refresh_token!,
    })

    await prisma.site.update({
      where: { id: site.id },
      data: {
        stripeOAuthToken: newToken as any,
      },
    })

    const oauthStripe = new Stripe(newToken.access_token!, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
    return oauthStripe
  }
}

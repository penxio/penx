import { getServerSession, getSessionOptions } from '@/lib/session'
import { stripe } from '@penx/libs/stripe'
import { SessionData } from '@penx/types'
import { prisma } from '@penx/db'
import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!
const clientSecret = process.env.GITHUB_CLIENT_SECRET!

/**
 
=======>>>>>>>>>>: {
  access_token: 'sk_test_51QybKNAogWkzgCQH6k4UoSfwYpIa59vptn7GaedQOP9m7HkWEECqDGHbL5JfIcADU8HRQ36jfrEw1jU54gvncjB800Gb2L63rF',
  livemode: false,
  refresh_token: 'rt_RshZUq0eqDZpxmKPZ3TdGpp3rJdEDWM7pB36I8nxIkp6ZnAM',
  token_type: 'bearer',
  stripe_publishable_key: 'pk_test_51QybKNAogWkzgCQHgEp9FJT1l29HRTrOuKoA0zhiTAoyh2KbJwxxMBPwjZwLXjeKNsY1mIzCk0PYRxjtz2VBc6yv00Tb8jeW2K',
  stripe_user_id: 'acct_1QybKNAogWkzgCQH',
  scope: 'read_write'
}

 */

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code') as string
  const siteId = url.searchParams.get('state') as string

  const sessionOptions = getSessionOptions()
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  console.log('======session:', session)

  console.log(
    'url=========>>>>>>>>>:',
    url,
    url.search,
    'code:',
    code,
    'siteId:',
    siteId,
  )

  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code,
  })

  console.log('=======>>>>>>>>>>:', response)

  await prisma.site.update({
    where: { id: siteId },
    data: {
      stripeOAuthToken: response as any,
    },
  })

  // const userStripe =

  // const oauthStripe = new Stripe(response.access_token!, {
  //   apiVersion: '2025-02-24.acacia',
  //   typescript: true,
  // })

  // const product = await oauthStripe.products.create({
  //   name: 'Member',
  //   description: 'Member plan',
  //   tax_code: 'txcd_10103000',
  // })

  // const monthlyPrice = await oauthStripe.prices.create({
  //   unit_amount: 1000, // $10
  //   currency: 'usd',
  //   recurring: { interval: 'month' },
  //   product: productId,
  // })

  // const yearlyPrice = await oauthStripe.prices.create({
  //   unit_amount: 10000,
  //   currency: 'usd',
  //   recurring: { interval: 'year' },
  //   product: productId,
  // })

  // await prisma.site.update({
  //   where: { id: siteId },
  //   data: {
  //     stripeOAuthToken: response,
  //     stripePayment: {
  //       productId: productId,
  //       monthlyPriceId: monthlyPrice.id,
  //       yearlyPriceId: yearlyPrice.id,
  //     },
  //   },
  // })

  return NextResponse.redirect(new URL('/~/settings/membership', req.url))
}

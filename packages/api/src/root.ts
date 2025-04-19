/**
 * This file contains the root router of your tRPC-backend
 */
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createCallerFactory, publicProcedure, router } from './trpc'
import { accessTokenRouter } from './routers/access-token'
import { affiliateRouter } from './routers/affiliate'
import { areaRouter } from './routers/area'
import { assetRouter } from './routers/asset'
import { billingRouter } from './routers/billing'
import { campaignRouter } from './routers/campaign'
import { cliRouter } from './routers/cli'
import { collaboratorRouter } from './routers/collaborator'
import { commentRouter } from './routers/comment'
import { couponRouter } from './routers/coupon'
import { creationRouter } from './routers/creation'
import { creationEngagementRouter } from './routers/creation-engagement'
import { creationImportRouter } from './routers/creation-import'
import { databaseRouter } from './routers/database'
import { deliveryRouter } from './routers/delivery'
import { extensionRouter } from './routers/extension'
import { githubRouter } from './routers/github'
import { googleRouter } from './routers/google'
import { hostedSiteRouter } from './routers/hosted-site'
import { memberRouter } from './routers/member'
import { messageRouter } from './routers/message'
import { moldRouter } from './routers/mold'
import { newsletterRouter } from './routers/newsletter'
import { orderRouter } from './routers/order'
import { pageRouter } from './routers/page'
import { payoutRouter } from './routers/payout'
import { payoutAccountRouter } from './routers/payout-account'
import { planRouter } from './routers/plan'
import { pledgeRouter } from './routers/pledge'
import { productRouter } from './routers/product'
import { referralRouter } from './routers/referral'
import { rewardsRouter } from './routers/rewards'
import { siteRouter } from './routers/site'
import { spaceRouter } from './routers/space'
import { stripeRouter } from './routers/stripe'
import { subscriberRouter } from './routers/subscriber'
import { tagRouter } from './routers/tag'
import { themeRouter } from './routers/theme'
import { tierRouter } from './routers/tier'
import { userRouter } from './routers/user'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => 'yay!'),
  cli: cliRouter,
  site: siteRouter,
  hostedSite: hostedSiteRouter,
  user: userRouter,
  creation: creationRouter,
  tag: tagRouter,
  google: googleRouter,
  accessToken: accessTokenRouter,
  comment: commentRouter,
  message: messageRouter,
  space: spaceRouter,
  collaborator: collaboratorRouter,
  rewards: rewardsRouter,
  theme: themeRouter,
  asset: assetRouter,
  database: databaseRouter,
  page: pageRouter,
  coupon: couponRouter,
  extension: extensionRouter,
  plan: planRouter,
  subscriber: subscriberRouter,
  delivery: deliveryRouter,
  newsletter: newsletterRouter,
  billing: billingRouter,
  github: githubRouter,
  stripe: stripeRouter,
  tier: tierRouter,
  creationImport: creationImportRouter,
  product: productRouter,
  order: orderRouter,
  campaign: campaignRouter,
  pledge: pledgeRouter,
  area: areaRouter,
  referral: referralRouter,
  affiliate: affiliateRouter,
  payoutAccount: payoutAccountRouter,
  payout: payoutRouter,
  member: memberRouter,
  mold: moldRouter,
  creationEngagement: creationEngagementRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>

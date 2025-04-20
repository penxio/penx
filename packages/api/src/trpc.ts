/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @link https://trpc.io/docs/v11/router
 * @link https://trpc.io/docs/v11/procedures
 */

import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { prisma } from '@penx/db'
import { CollaboratorRole } from '@prisma/client'
import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  /**
   * @link https://trpc.io/docs/v11/data-transformers
   */
  transformer: superjson,
  /**
   * @link https://trpc.io/docs/v11/error-formatting
   */
  errorFormatter({ shape }) {
    return shape
  },
})

/**
 * Create a router
 * @link https://trpc.io/docs/v11/router
 */
export const router = t.router

/**
 * Create an unprotected procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure

/**
 * Merge multiple routers together
 * @link https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters

/**
 * Create a server-side caller
 * @link https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

// procedure that asserts that the user is logged in
export const protectedProcedure = t.procedure.use(
  async ({ ctx, next, path, ...rest }) => {
    if (!ctx.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'user not found',
      })
    }

    if (
      ctx.isFree &&
      [
        'database.create',
        // 'asset.create',
        'collaborator.addCollaborator',
      ].includes(path)
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message:
          'You are currently on the Free plan. Please upgrade your subscription to continue.',
      })
    }

    // console.log('=====ctx.token:', ctx.token, 'path:', path)

    const activeSiteId = ctx.token.activeSiteId

    const userId = ctx.token.uid || ''
    // console.log('=====activeSiteId:', activeSiteId, 'userId:', userId)

    if (
      [
        'site.listSiteSubdomains',
        'site.mySite',
        'site.bySubdomain',
        'site.updateSite',
        'site.enableFeatures',
        'site.addSubdomain',
        'site.deleteSubdomain',
        'site.customDomain',
        'site.deleteSite',
        'accessToken.create',
        'accessToken.delete',
        'asset.list',
        'asset.trashedAssets',
        'asset.create',
        'asset.trash',
        'asset.delete',
        'asset.updatePublicStatus',
        'collaborator.listSiteCollaborators',
        'collaborator.addCollaborator',
        'collaborator.updateCollaborator',
        'collaborator.deleteCollaborator',
        'database.list',
        'database.byId',
        'database.create',
        'database.addRecord',
        'database.addRefBlockRecord',
        'database.addColumn',
        'database.updateColumn',
        'database.sortViewFields',
        'database.updateRecord',
        'database.deleteField',
        'database.deleteRecord',
        'database.updateViewColumn',
        'database.addOption',
        'database.updateDatabase',
        'database.deleteDatabase',
        'page.list',
        'page.byId',
        'page.getPage',
        'page.create',
        'page.update',
        'page.delete',
        'plan.subscribe',
        'post.listSitePosts',
        'post.publish',
        'post.byId',
        'post.bySlug',
        'post.create',
        'post.update',
        'post.publish',
        'post.archive',
        'post.delete',
        'post.addAuthor',
        'post.deleteAuthor',
        'post.updatePublishedPost',
        'subscriber.list',
        'subscriber.count',
        'subscriber.create',
        'subscriber.updateStatus',
        'subscriber.delete',
        'subscriber.importSubscribers',
        'delivery.list',
        'delivery.updateStatus',
        'tier.addTier',
        'tier.updateTier',
        'payout.withdrawSiteIncome',
        'payout.withdrawCommission',
      ].includes(path)
    ) {
      // TODO: improve performance by caching the result of this query
      const collaborator = await prisma.collaborator.findFirst({
        where: { userId, siteId: activeSiteId },
      })

      const roles = [
        CollaboratorRole.ADMIN,
        CollaboratorRole.OWNER,
        CollaboratorRole.WRITE,
      ] as CollaboratorRole[]

      if (!collaborator || !roles.includes(collaborator.role)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No permission to access this resource',
        })
      }
    }

    return next({
      ctx: {
        token: ctx.token,
        activeSiteId,
      },
    })
  },
)

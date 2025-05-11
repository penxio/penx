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
import { CollaboratorRole } from '@penx/db/client'
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


    return next({
      ctx: {
        token: ctx.token,
        activeSiteId,
      },
    })
  },
)

import { TRPCError } from '@trpc/server'
import Redis from 'ioredis'
import { z } from 'zod'
import { redisKeys } from '@penx/constants'
import { prisma } from '@penx/db'
import { publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

const pageViewSchema = z.object({
  creationId: z.string(),
  sessionId: z.string(),
})

// Helper function to initialize Redis from database
async function initializePageViewFromDB(creationId: string) {
  try {
    // Check if the key exists in Redis
    const pvKey = redisKeys.postEngagement(creationId)
    const exists = await redis.exists(pvKey)

    if (!exists) {
      // Get data from database
      const stats = await prisma.creationEngagementStats.findUnique({
        where: { creationId },
      })

      if (stats) {
        // Set the value in Redis with lastUpdated timestamp
        const now = Date.now()
        await redis.hmset(pvKey, {
          count: stats.pageViews,
          lastUpdated: now,
        })
        return stats.pageViews
      } else {
        // Initialize with 0 count and current timestamp
        const now = Date.now()
        await redis.hmset(pvKey, {
          count: 0,
          lastUpdated: now,
        })
        return 0
      }
    }

    return 0
  } catch (error) {
    console.error('Failed to initialize Redis from DB:', error)
    return 0
  }
}

export const creationEngagementRouter = router({
  recordPageView: publicProcedure
    .input(pageViewSchema)
    .mutation(async ({ input }) => {
      try {
        const { creationId, sessionId } = input
        const pvKey = redisKeys.postEngagement(creationId)

        // Check if Redis has the key, if not initialize from DB
        await initializePageViewFromDB(creationId)

        // Increment PV count in Redis and update timestamp
        const now = Date.now()
        await redis.hincrby(pvKey, 'count', 1)
        await redis.hset(pvKey, 'lastUpdated', now)

        return { success: true }
      } catch (error) {
        console.error('Failed to record page view:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to record page view',
        })
      }
    }),

  // Get post statistics
  getPageViews: publicProcedure
    .input(z.object({ creationId: z.string() }))
    .query(async ({ input }) => {
      try {
        const { creationId } = input
        const pvKey = redisKeys.postEngagement(creationId)

        // Check if Redis has the key, if not initialize from DB
        await initializePageViewFromDB(creationId)

        // Get PV count and lastUpdated from Redis
        const data = await redis.hgetall(pvKey)
        const pvCount = data.count ? parseInt(data.count) : 0

        return {
          pv: pvCount,
        }
      } catch (error) {
        console.error('Failed to get post stats:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get post statistics',
        })
      }
    }),
})

import { zValidator } from '@hono/zod-validator'
import { and, asc, eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { produce } from 'immer'
import { z } from 'zod'
import { db } from '@penx/db/client'
import { changes } from '@penx/db/schema'
import { Change } from '@penx/db/schema/change'
import { auth } from '../lib/auth'

const app = new Hono()

app.get('/listAll', async (c) => {
  return c.json({
    success: true,
    data: await db.query.changes.findMany(),
  })
})

app.get(
  '/listBySpace',
  zValidator(
    'query',
    z.object({
      spaceId: z.string(),
    }),
  ),
  async (c) => {
    const input = c.req.valid('query')
    const list = await db.query.changes.findMany({
      where: and(eq(changes.spaceId, input.spaceId), eq(changes.synced, 0)),
      orderBy: asc(changes.id),
    })

    return c.json({
      success: true,
      data: list,
    })
  },
)

app.post(
  '/create',
  // auth,
  zValidator(
    'json',
    z.object({
      operation: z.any(),
      spaceId: z.string(),
      synced: z.number(),
      createdAt: z.any(),
      key: z.string(),
      data: z.any(),
    }),
  ),
  async (c) => {
    const input = c.req.valid('json')

    await db.insert(changes).values({
      ...input,
      createdAt: new Date(input.createdAt),
    } as Change)

    return c.json({
      success: true,
    })
  },
)

app.post(
  '/update',
  // auth,
  zValidator(
    'json',
    z.object({
      id: z.any(),
      operation: z.any(),
      spaceId: z.string(),
      synced: z.number(),
      createdAt: z.any(),
      key: z.string(),
      data: z.any(),
    }),
  ),
  async (c) => {
    const { id, ...rest } = c.req.valid('json')
    const data = produce(rest, (draft) => {
      draft.createdAt = new Date(draft.createdAt)
      if (draft?.data?.updatedAt) {
        draft.data.updatedAt = new Date(draft.data.updatedAt)
      }
      if (draft?.data?.createdAt) {
        draft.data.createdAt = new Date(draft.data.createdAt)
      }
    })
    await db.update(changes).set(data).where(eq(changes.id, id))
    return c.json({
      success: true,
    })
  },
)

app.post(
  '/deleteOne',
  // auth,
  zValidator(
    'json',
    z.object({
      id: z.any(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid('json')
    await db.delete(changes).where(eq(changes.id, id))
    return c.json({
      success: true,
    })
  },
)

app.post(
  '/deleteByIds',
  // auth,
  zValidator(
    'json',
    z.object({
      ids: z.array(z.any()),
    }),
  ),
  async (c) => {
    const { ids } = c.req.valid('json')
    await db.delete(changes).where(inArray(changes.id, ids))
    return c.json({
      success: true,
    })
  },
)

export default app

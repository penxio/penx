import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { createAssetInputSchema } from '@penx/constants'
import { client } from '@penx/db/client'
import { nodes } from '@penx/db/schema/nodes'

const app = new Hono()

app.get(
  '/list',
  // zValidator(
  //   'json',
  //   z.object({
  //     url: z.string(),
  //   }),
  // ),
  async (c) => {
    // const { url } = c.req.valid('json')
    // const result = await client.select().from(nodes).where(eq(nodes, 'STRUCT'))
    const result = await client
      .select()
      .from(nodes)
      .where(eq(nodes.type, 'STRUCT'))

    return c.json({
      data: result,
      success: true,
    })
  },
)

// app.post(
//   '/create',
//   auth,
//   zValidator('json', createAssetInputSchema),
//   async (c) => {
//   },
// )

export default app

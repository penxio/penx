import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { createAssetInputSchema } from '@penx/constants'

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

    return c.json({
      name: 'ziyi',
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

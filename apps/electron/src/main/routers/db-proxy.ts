import { Hono } from 'hono'
import { db, pg } from '@penx/db/client'

const app = new Hono()

app.post('/query', async (c) => {
  try {
    const { sql, params, method } = await c.req.json()

    // Prevent multiple queries
    const sqlBody = sql.replace(/;/g, '')

    // console.log(
    //   '>>>>>>>>sqlBody:',
    //   sqlBody,
    //   'params:',
    //   params,
    //   'method:',
    //   method,
    // )

    const result = await pg.query(sql, params, {
      rowMode: method === 'all' ? 'array' : undefined,
    })

    // console.log('======result:', result)

    // Return raw data from database, let client handle date processing
    // return c.json({ rows: result.rows })
    return c.json(result)
  } catch (error: any) {
    console.error('Database query error:', error)
    return c.json({ error: error.message }, 500)
  }
})

export default app

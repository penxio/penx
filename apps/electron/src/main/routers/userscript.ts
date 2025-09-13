import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

app.get(
  '/:id',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid('param')

    // Define script mappings
    const scripts: Record<string, string> = {
      'hello.js': "console.log('hello'); alert(123);",
      // Add more scripts as needed
    }

    // Get the script content
    const scriptContent = scripts[id]

    if (!scriptContent) {
      return c.text('Script not found', 404)
    }

    // Set proper Content-Type header for JavaScript
    c.header('Content-Type', 'application/javascript; charset=utf-8')
    
    return c.text(scriptContent)
  },
)

export default app

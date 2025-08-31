import { createMiddleware } from 'hono/factory'
import { BusinessError } from './BusinessError'

export const auth = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  const userId = c.get('userId')

  if (!userId) {
    throw new BusinessError('UNAUTHORIZED', 'Unauthorized')
  }
  await next()
})

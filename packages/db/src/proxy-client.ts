import { drizzle } from 'drizzle-orm/pg-proxy'
import { nodes } from './schema/nodes'

// Create a proxy client for renderer usage
export const createProxyClient = (
  baseUrl: string = 'http://localhost:14158',
) => {
  return drizzle(async (sql, params, method) => {
    try {
      const response = await fetch(`${baseUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params, method }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('========result:', result)

      return result
    } catch (error: any) {
      console.error('Error from pg proxy server:', error)
      return { rows: [] }
    }
  })
}

// Export the schema for use in renderer
export { nodes }

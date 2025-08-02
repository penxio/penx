import { drizzle } from 'drizzle-orm/pg-proxy'
import { produce } from 'immer'

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

      return {
        ...result,
        rows: result.rows.map((row: any[]) => {
          return produce(row, (draft) => {
            for (let i = 0; i < draft.length; i++) {
              // isDate
              if (
                result.fields[i].name === 'created_at' ||
                result.fields[i].name === 'updated_at'
              ) {
                draft[i] = new Date(draft[i])
              }
            }
          })
        }),
      }
    } catch (error: any) {
      console.error('Error from pg proxy server:', error)
      return { rows: [] }
    }
  })
}

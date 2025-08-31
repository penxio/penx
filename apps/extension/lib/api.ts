import { storage } from '@/lib/storage'
import _ky from 'ky'
import { APP_LOCAL_HOST } from '@penx/constants'

async function getHeaders(): Promise<Record<string, any>> {
  const session = await storage.getSession()
  if (session?.accessToken) {
    return {
      Authorization: `Bearer ${session.userId}`,
    }
  }

  return {}
}

export const ky = _ky.extend({
  prefixUrl: APP_LOCAL_HOST,
  hooks: {
    beforeRequest: [
      async (request) => {
        const headers = await getHeaders()
        Object.entries(headers).forEach(([key, value]) => {
          request.headers.set(key, value)
        })
      },
    ],
    beforeError: [
      async (error) => {
        if (error.response) {
          try {
            const errorBody = await error.response.json()
            return errorBody as any
          } catch (parseError) {
            return error
          }
        } else {
          return error
        }
      },
    ],
  },
})

export interface ApiRes<T = any> {
  success: boolean
  data: T
}

export const api = {
  async createBookmarks(bookmarks: any[]) {
    await ky
      .post('api/bookmark/createMany', {
        json: { bookmarks },
      })
      .json()
  },
}

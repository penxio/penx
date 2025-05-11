'use client'

import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { get } from 'idb-keyval'
import superjson from 'superjson'
import { type AppRouter } from '@penx/api'
import { isDesktop, isMobileApp, ROOT_HOST } from '@penx/constants'

const link = httpBatchLink({
  url: `${ROOT_HOST}/api/trpc`,
  fetch: isDesktop ? tauriFetch : fetch,
  // fetch: tauriFetch,
  transformer: superjson,
  async headers() {
    if (isDesktop || isMobileApp) {
      const session = await get('SESSION')
      console.log('========session>>>>>:', session.accessToken)

      if (session?.accessToken) {
        return {
          Authorization: session.accessToken,
        }
      }
    }
    return {
      // Authorization: config.token,
    }
  },
})

export const api = createTRPCClient<AppRouter>({
  links: [link],
})

export const trpc = createTRPCReact<AppRouter>({})

export const trpcClient = trpc.createClient({
  links: [link],
})

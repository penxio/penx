'use client'

import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { get } from 'idb-keyval'
import superjson from 'superjson'
import { type AppRouter } from '@penx/api'

// @ts-ignore
const HOST = import.meta.env?.WXT_BASE_URL ?? ''

const link = httpBatchLink({
  url: `${HOST}/api/trpc`,
  transformer: superjson,
})

export const api = createTRPCClient<AppRouter>({
  links: [link],
})

export const trpc = createTRPCReact<AppRouter>({})

export const trpcClient = trpc.createClient({
  links: [link],
})

'use client'

import { AppRouter } from '@/server/_app'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { get } from 'idb-keyval'
import superjson from 'superjson'

const link = httpBatchLink({
  url: `/api/trpc`,
  transformer: superjson,
})

export const api = createTRPCClient<AppRouter>({
  links: [link],
})

export const trpc = createTRPCReact<AppRouter>({})

export const trpcClient = trpc.createClient({
  links: [link],
})

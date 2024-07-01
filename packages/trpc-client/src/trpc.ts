import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'
import { BASE_URL } from '@penx/constants'
import { getHeaders } from './getHeaders'

// TODO: handle any

export const api = createTRPCClient<any>({
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
      transformer: superjson,
      async headers() {
        console.log('headers', await getHeaders())

        return await getHeaders()
      },
    }),
  ],
}) as any // TODO: handle any

export const trpc = createTRPCReact<any>() as any

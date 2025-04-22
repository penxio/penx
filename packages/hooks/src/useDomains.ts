import { api, trpc } from '@penx/trpc-client'

export function useDomains() {
  const { data = [], ...rest } = trpc.site.listSiteDomains.useQuery()
  return {
    data: data,
    domains: data,
    ...rest,
  }
}

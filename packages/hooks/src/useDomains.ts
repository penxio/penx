import { isExtension, isWeb } from '@penx/constants'
import { api, trpc } from '@penx/trpc-client'

export function useDomains() {
  const { data = [], ...rest } = trpc.site.listSiteDomains.useQuery(undefined, {
    enabled: isWeb || isExtension,
  })
  return {
    data: data,
    domains: data,
    ...rest,
  }
}

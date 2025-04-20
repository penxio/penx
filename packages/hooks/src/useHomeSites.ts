import { trpc } from '@penx/trpc-client'

export function useHomeSites() {
  return trpc.site.homeSites.useQuery()
}

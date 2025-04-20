import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'

export function useMySites() {
  const { data } = useSession()
  return trpc.site.mySites.useQuery(undefined, {
    enabled: !!data,
    staleTime: 1000 * 60,
  })
}

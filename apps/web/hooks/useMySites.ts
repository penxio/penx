import { useSession } from '@/components/session'
import { trpc } from '@/lib/trpc'

export function useMySites() {
  const { data } = useSession()
  return trpc.site.mySites.useQuery(undefined, {
    enabled: !!data,
    staleTime: 1000 * 60,
  })
}

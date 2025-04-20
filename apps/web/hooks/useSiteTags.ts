import { useSession } from '@penx/session'
import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@penx/trpc-client'

export function useSiteTags() {
  const { session } = useSession()
  const siteId = session?.activeSiteId!
  return trpc.tag.listSiteTags.useQuery(
    { siteId },
    {
      enabled: !!siteId,
      staleTime: 1000 * 60,
    },
  )
}

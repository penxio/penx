import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'

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

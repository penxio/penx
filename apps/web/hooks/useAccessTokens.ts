import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'

export function useAccessTokens() {
  const site = useSiteContext()
  return trpc.accessToken.list.useQuery({ siteId: site.id })
}

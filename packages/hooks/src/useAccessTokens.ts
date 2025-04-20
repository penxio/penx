import { useSiteContext } from '@penx/contexts/SiteContext'
import { trpc } from '@penx/trpc-client'

export function useAccessTokens() {
  const site = useSiteContext()
  return trpc.accessToken.list.useQuery({ siteId: site.id })
}

import { RouterOutputs } from '@penx/api'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { trpc } from '@penx/trpc-client'

type Asset = RouterOutputs['asset']['list'][0]

export function useTrashedAssets() {
  const site = useSiteContext()
  return trpc.asset.trashedAssets.useQuery({
    siteId: site.id,
    pageSize: 10000,
  })
}

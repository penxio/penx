import { useSiteContext } from '@/components/SiteContext'
import { trpc } from '@/lib/trpc'
import { RouterOutputs } from '@/server/_app'

export type Asset = RouterOutputs['asset']['list'][0]

export function useTrashedAssets() {
  const site = useSiteContext()
  return trpc.asset.trashedAssets.useQuery({
    siteId: site.id,
    pageSize: 10000,
  })
}

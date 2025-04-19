import isEqual from 'react-fast-compare'
import { useSiteContext } from '@/components/SiteContext'
import { localDB } from '@/lib/local-db'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { RouterOutputs } from '@penx/api'
import { useQuery } from '@tanstack/react-query'

export type Asset = RouterOutputs['asset']['list'][0]

function equal(remoteAssets: Asset[], localAssets: any[]): boolean {
  if (remoteAssets.length !== localAssets.length) return false

  const isSame = remoteAssets.every((remote, index) => {
    const local = localAssets[index]
    return isEqual(remote, local)
  })

  return isSame
}

export function useAssets() {
  const site = useSiteContext()
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const assets = await localDB.asset.where({ siteId: site.id }).toArray()
      const localAssets = assets.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      )

      setTimeout(async () => {
        const remoteAssets = await api.asset.list.query({
          siteId: site.id,
          pageSize: 100000,
        })

        const isEqual = equal(remoteAssets, localAssets)

        if (isEqual) return
        queryClient.setQueriesData({ queryKey: ['assets'] }, remoteAssets)
        await localDB.asset.clear()
        await localDB.asset.bulkAdd(remoteAssets as any)
      }, 0)

      return localAssets as Asset[]
    },
  })
}

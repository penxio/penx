import isEqual from 'react-fast-compare'
import { useSiteContext } from '@/components/SiteContext'
import { localDB } from '@/lib/local-db'
import { queryClient } from '@/lib/queryClient'
import { api, trpc } from '@/lib/trpc'
import { Creation } from '@penx/db/client'
import { useQuery } from '@tanstack/react-query'

function equal(remotePages: Creation[], localPages: any[]): boolean {
  if (remotePages.length !== localPages.length) return false

  const isSame = remotePages.every((remotePage, index) => {
    const localPage = localPages[index]
    return isEqual(remotePage, localPage)
  })

  return isSame
}

export function usePages() {
  const site = useSiteContext()
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      // const pages = await localDB.page.where({ siteId: site.id }).toArray()
      // const localPages = pages.sort(
      //   (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      // )

      // setTimeout(async () => {
      //   const remotePages = await api.page.list.query({ siteId: site.id })
      //   const isEqual = equal(remotePages, localPages)
      //   // console.log('===isEqual:', isEqual)

      //   if (isEqual) return
      //   queryClient.setQueriesData({ queryKey: ['pages'] }, remotePages)
      //   await localDB.page.clear()
      //   await localDB.page.bulkAdd(remotePages as any)
      // }, 0)

      // return localPages as any as Page[]
      return await api.page.list.query({ siteId: site.id })
    },
  })
}

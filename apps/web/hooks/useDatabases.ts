import isEqual from 'react-fast-compare'
import { useSiteContext } from '@/components/SiteContext'
import { localDB } from '@/lib//local-db'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { Database } from '@penx/db/client'
import { useQuery } from '@tanstack/react-query'

function equal(remoteDatabases: Database[], localDatabases: any[]): boolean {
  if (remoteDatabases.length !== localDatabases.length) return false

  const isSame = remoteDatabases.every((remote, index) => {
    const local = localDatabases[index]
    return isEqual(remote, local)
  })

  return isSame
}

export function useDatabases() {
  const site = useSiteContext()
  return useQuery({
    queryKey: ['databases'],
    queryFn: async () => {
      const databases = await localDB.database
        .where({ siteId: site.id })
        .toArray()
      const localDatabases = databases.sort((a, b) => {
        const updatedAtDiff = b.updatedAt.getTime() - a.updatedAt.getTime()
        if (updatedAtDiff === 0) {
          return b.createdAt.getTime() - a.createdAt.getTime()
        }

        return updatedAtDiff
      })

      setTimeout(async () => {
        const remoteDatabases = await api.database.list.query({
          siteId: site.id,
        })
        const isEqual = equal(remoteDatabases, localDatabases)

        if (isEqual) return
        await localDB.database.clear()
        await localDB.database.bulkAdd(remoteDatabases as any)
        queryClient.setQueriesData({ queryKey: ['databases'] }, remoteDatabases)
      }, 0)

      return localDatabases as any as Database[]
    },
  })
}

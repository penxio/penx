import isEqual from 'react-fast-compare'
import { useQuery } from '@tanstack/react-query'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Database } from '@penx/db/client'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'

function equal(remoteDatabases: Database[], localDatabases: any[]): boolean {
  if (remoteDatabases.length !== localDatabases.length) return false

  const isSame = remoteDatabases.every((remote, index) => {
    const local = localDatabases[index]
    return isEqual(remote, local)
  })

  return isSame
}

export function useDatabases() {
  const { session } = useSession()
  const siteId = session?.siteId!
  return useQuery({
    enabled: !!siteId,
    queryKey: ['databases'],
    queryFn: async () => {
      const remoteDatabases = await api.database.list.query({
        siteId,
      })
      return remoteDatabases
    },
  })
}

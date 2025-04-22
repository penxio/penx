import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'

export function useMolds() {
  const { session } = useSession()

  return useQuery({
    queryKey: ['molds'],
    queryFn: async () => {
      return localDB.mold.where({ siteId: session.siteId }).toArray()
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'

const key = 'SYNC_SERVER_PASSWORD'

export function useSyncServerPassword() {
  const { session } = useSession()
  return useQuery({
    queryKey: [key, session.siteId],
    queryFn: async () => {
      let password = await get(`${key}_${session.siteId}`)
      return (password as string) || ''
    },
    enabled: !!session?.siteId,
  })
}

export async function setSyncServerPassword(siteId: string, password: string) {
  await set(`${key}_${siteId}`, password)
  queryClient.setQueryData([key, siteId], password)
}

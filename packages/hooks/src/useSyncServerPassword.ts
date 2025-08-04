import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'

const key = 'SYNC_SERVER_PASSWORD'

export function useSyncServerPassword() {
  const { session } = useSession()
  return useQuery({
    queryKey: [key, session?.spaceId],
    queryFn: async () => {
      let password = await get(`${key}_${session.spaceId}`)
      return (password as string) || ''
    },
    enabled: !!session?.spaceId,
  })
}

export async function setSyncServerPassword(spaceId: string, password: string) {
  await set(`${key}_${spaceId}`, password)
  queryClient.setQueryData([key, spaceId], password)
}

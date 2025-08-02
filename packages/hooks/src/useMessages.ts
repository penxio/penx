import { useQuery } from '@tanstack/react-query'
import { idb } from '@penx/indexeddb'
import { queryClient } from '@penx/query-client'
import { getSession, useSession } from '@penx/session'

const queryKey = ['messages']

export async function queryMessages(spaceId: string) {
  const list = await idb.message.where({ spaceId }).toArray()

  return list
    .toSorted((a, b) => {
      return a.createdAt.valueOf() - b.createdAt.valueOf()
    })
    .map((m) => ({ ...m, content: m.parts[0].text }))
}

export function useMessages() {
  const { session } = useSession()
  return useQuery({
    queryKey,
    queryFn: async () => {
      return queryMessages(session.spaceId)
    },
  })
}

export async function refetchMessages() {
  const session = await getSession()
  const messages = await queryMessages(session.spaceId)
  queryClient.setQueryData(queryKey, messages)
  return messages
}

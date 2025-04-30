import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { getSession, useSession } from '@penx/session'

const queryKey = ['messages']

export async function queryMessages(siteId: string) {
  const list = await localDB.message.where({ siteId }).toArray()

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
      return queryMessages(session.siteId)
    },
  })
}

export async function refetchMessages() {
  const session = await getSession()
  const messages = await queryMessages(session.siteId)
  queryClient.setQueryData(queryKey, messages)
  return messages
}

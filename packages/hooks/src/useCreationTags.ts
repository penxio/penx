import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'
import { ICreationTag } from '@penx/model-type/ICreationTag'
import { queryClient } from '@penx/query-client'
import { getSession, useSession } from '@penx/session'
import { api, trpc } from '@penx/trpc-client'

const queryKey = ['creation-tags']

export function useCreationTags() {
  const { session } = useSession()
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      const list = await localDB.creationTag
        .where({ siteId: session.siteId })
        .toArray()
      return list
    },
  })
  return { data, ...rest }
}

export function getCreationTags() {
  return queryClient.getQueryData(queryKey) as ICreationTag
}

export async function refetchCreationTags() {
  const session = await getSession()
  const siteId = session.siteId
  const list = await localDB.creationTag.where({ siteId }).toArray()
  queryClient.setQueryData(queryKey, list)
}

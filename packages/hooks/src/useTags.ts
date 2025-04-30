import { useQuery } from '@tanstack/react-query'
import { getActiveSite } from '@penx/libs/getActiveSite'
import { localDB } from '@penx/local-db'
import { ITag } from '@penx/model-type/ITag'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'

const queryKey = ['tags']
export function useTags() {
  const { session } = useSession()
  return useQuery({
    queryKey,
    queryFn: async () => {
      return localDB.tag.where({ siteId: session.siteId }).toArray()
    },
    enabled: !!session?.siteId,
  })
}

export async function refetchTags() {
  const site = await getActiveSite()
  const tags = await localDB.tag.where({ siteId: site.id }).toArray()
  console.log('=====>>>>>>newTag:', tags)

  queryClient.setQueryData(queryKey, tags)
}

export async function deleteTag(tag: ITag) {
  await localDB.creationTag.where({ tagId: tag.id }).delete()
  await localDB.tag.delete(tag.id)
  await refetchTags()
  api.tag.deleteTag.mutate({
    tagId: tag.id,
  })
}

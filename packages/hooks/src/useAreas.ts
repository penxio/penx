import { AreaType } from '@penx/db/client'
import { useQuery } from '@tanstack/react-query'
import { getActiveSite } from '@penx/libs/getActiveSite'
import { getInitialWidgets } from '@penx/libs/getInitialWidgets'
import { localDB } from '@penx/local-db'
import { IArea } from '@penx/model/IArea'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { uniqueId } from '@penx/unique-id'

const queryKey = ['areas']

export function useAreas() {
  const { session } = useSession()
  return useQuery({
    queryKey,
    queryFn: async () => {
      return localDB.area.where({ siteId: session.siteId }).toArray()
    },
  })
}

export async function refetchAreas() {
  const site = await getActiveSite()
  const list = await localDB.area.where({ siteId: site.id }).toArray()
  queryClient.setQueryData(queryKey, list)
  return list
}

export async function addArea(input: any) {
  const site = await getActiveSite()
  const id = uniqueId()
  const area = {
    ...input,
    id,
    cover: '',
    widgets: getInitialWidgets(),
    type: AreaType.SUBJECT,
    props: {},
    favorites: [],
    isGenesis: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: site.userId,
    siteId: site.id,
  } as IArea

  await localDB.area.add(area)
  refetchAreas()
  api.area.createArea.mutate({ id, ...input })
  return area
}

export async function deleteArea(area: IArea) {
  await localDB.area.delete(area.id)
  const areas = await refetchAreas()
  api.area.deleteArea.mutate({
    id: area.id,
  })
  return areas
}

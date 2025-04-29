'use client'

import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { getActiveSite } from '@penx/libs/getActiveSite'
import { localDB } from '@penx/local-db'
import { ICreation } from '@penx/model/ICreation'
import { queryClient } from '@penx/query-client'
import { getSession, useSession } from '@penx/session'

function getQueryKey(areaId: string) {
  return ['area', 'creations', areaId]
}

export function useCreations() {
  const { session } = useSession()
  return useQuery({
    queryKey: getQueryKey(session?.activeAreaId),
    queryFn: async () => {
      const site = await getActiveSite()
      const creations = await localDB.creation
        .where({ siteId: site.id, areaId: session.activeAreaId })
        .toArray()
      return creations
    },
    enabled: !!session?.activeAreaId,
  })
}

function getCreations(areaId: string) {
  const queryKey = getQueryKey(areaId)
  return (queryClient.getQueryData(queryKey) as ICreation[]) || []
}

export async function addCreation(creation: ICreation) {
  queryClient.setQueryData(getQueryKey(creation.areaId!), [
    creation,
    ...getCreations(creation.areaId!),
  ])
  await localDB.addCreation(creation)
}

export function updateCreationById(
  areaId: string,
  creationId: string,
  data: Partial<ICreation>,
) {
  const queryKey = getQueryKey(areaId)
  const creations = getCreations(areaId)
  const newCreations = produce(creations, (draft) => {
    const index = draft.findIndex((p) => p.id === creationId)
    draft[index] = {
      ...draft[index],
      ...data,
    }
  })

  queryClient.setQueryData(queryKey, newCreations)
}

export async function deleteCreation(creation: ICreation) {
  const session = await getSession()
  const areaId = session.activeAreaId!

  await localDB.deleteCreation(creation.id)
  const creations = await localDB.creation
    .where({ siteId: creation.siteId })
    .toArray()

  queryClient.setQueryData(getQueryKey(areaId), creations)
}

export async function refetchCreations() {
  const session = await getSession()
  const areaId = session?.activeAreaId
  if (session.siteId && session.activeAreaId) {
    const creations = await localDB.creation
      .where({ siteId: session.siteId, areaId: session.activeAreaId })
      .toArray()

    queryClient.setQueryData(getQueryKey(areaId), creations)
  }
}

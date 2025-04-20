'use client'

import { getSession, useSession } from '@penx/session'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { SiteCreation } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'

function getQueryKey(areaId: string) {
  return ['area', 'creations', areaId]
}

export function useAreaCreations() {
  const { session } = useSession()
  return useQuery({
    queryKey: getQueryKey(session?.activeAreaId!),
    queryFn: async () => {
      const creations = await api.creation.listCreationsByArea.query({
        areaId: session?.activeAreaId!,
      })

      return creations
    },
    staleTime: 1000 * 10,
    enabled: !!session?.activeAreaId,
  })
}

function getCreations(areaId: string) {
  const queryKey = getQueryKey(areaId)
  return (queryClient.getQueryData(queryKey) as SiteCreation[]) || []
}

export function addCreation(creation: SiteCreation) {
  queryClient.setQueryData(getQueryKey(creation.areaId!), [
    creation,
    ...getCreations(creation.areaId!),
  ])
}

export function updateCreationById(
  areaId: string,
  creationId: string,
  data: Partial<SiteCreation>,
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

export async function refetchAreaCreations() {
  const session = getSession()
  const areaId = session.activeAreaId!

  const posts = await api.creation.listCreationsByArea.query({
    areaId,
  })
  queryClient.setQueryData(getQueryKey(areaId), posts)
}

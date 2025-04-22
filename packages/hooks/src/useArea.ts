import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { UpdateAreaInput } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { IArea } from '@penx/model/IArea'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { Widget } from '@penx/types'
import { refetchAreas } from './useAreas'

export function useArea() {
  const { session } = useSession()

  // const id = params?.id as string
  const { data, ...rest } = useQuery({
    queryKey: getQueryKey(session?.activeAreaId),
    queryFn: async () => {
      const area = await localDB.area.get(session?.activeAreaId)
      return area
    },
    enabled: !!session?.activeAreaId,
  })

  return {
    data: data as any as IArea,
    ...rest,
  }
}

function getQueryKey(areaId: string) {
  return ['areas', areaId]
}

function getArea(areaId: string) {
  return queryClient.getQueryData(getQueryKey(areaId)) as IArea
}

async function persistArea(input: UpdateAreaInput) {
  const { id, ...data } = input
  await localDB.area.update(id, data)
  api.area.updateArea.mutate(input)
}

export async function addWidget(areaId: string, widget: Widget) {
  const area = getArea(areaId)
  // console.log('========field:', field)

  const newArea = produce(area, (draft) => {
    draft.widgets.push(widget)
  })
  queryClient.setQueryData(getQueryKey(areaId), newArea)

  await persistArea({
    id: areaId!,
    widgets: newArea.widgets,
  })
}

export async function removeWidget(areaId: string, widgetId: string) {
  const area = getArea(areaId)
  const newArea = produce(area, (draft) => {
    draft.widgets = draft.widgets.filter((w) => w.id !== widgetId)
  })

  queryClient.setQueryData(getQueryKey(areaId), newArea)

  await persistArea({
    id: areaId!,
    widgets: newArea.widgets,
  })
}

export async function toggleCollapsed(areaId: string, widgetId: string) {
  const area = getArea(areaId)

  const newArea = produce(area, (draft) => {
    for (const widget of draft.widgets) {
      if (widgetId === widget.id) {
        widget.collapsed = !widget.collapsed
      }
    }
  })

  queryClient.setQueryData(getQueryKey(areaId), newArea)

  await persistArea({
    id: areaId!,
    widgets: newArea.widgets,
  })
}

export async function addToFavorites(areaId: string, creationId: string) {
  const area = getArea(areaId)
  const newField = produce(area, (draft) => {
    if (!Array.isArray(draft.favorites)) draft.favorites = []
    draft.favorites.push(creationId)
  })

  queryClient.setQueryData(getQueryKey(areaId), newField)

  await persistArea({
    id: areaId!,
    favorites: newField.favorites,
  })
}

export async function removeFromFavorites(areaId: string, creationId: string) {
  const area = getArea(areaId)
  const newArea = produce(area, (draft) => {
    draft.favorites = draft.favorites.filter((i) => i !== creationId)
  })

  queryClient.setQueryData(getQueryKey(areaId), newArea)

  await persistArea({
    id: areaId!,
    favorites: newArea.favorites,
  })
}

export async function updateArea(input: UpdateAreaInput) {
  const { id } = input
  const area = getArea(id)
  queryClient.setQueryData(getQueryKey(id), {
    ...area,
    ...input,
  })
  await persistArea(input)
  await refetchAreas()
}

export async function updateAreaState(areaId: string, data: Partial<IArea>) {
  const area = getArea(areaId)
  queryClient.setQueryData(getQueryKey(areaId), {
    ...area,
    ...data,
  })
}

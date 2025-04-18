import { useSession } from '@/components/session'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { Widget } from '@/lib/types'
import { RouterOutputs } from '@/server/_app'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'

export type Area = Omit<
  RouterOutputs['area']['byId'],
  'widgets' | 'favorites'
> & {
  widgets: Widget[]
  favorites: string[]
}

export function useAreaItem() {
  // const params = useParams() as { id: string }
  const { session } = useSession()

  // const id = params?.id as string
  const { data, ...rest } = useQuery({
    queryKey: getQueryKey(session?.activeAreaId!),
    queryFn: () => api.area.byId.query(session?.activeAreaId!),
    enabled: !!session?.activeAreaId,
  })

  return {
    data: data as Area,
    ...rest,
  }
}

function getQueryKey(areaId: string) {
  return ['areas', areaId]
}

function getArea(areaId: string) {
  return queryClient.getQueryData(getQueryKey(areaId)) as Area
}

export async function addWidget(areaId: string, widget: Widget) {
  const area = getArea(areaId)
  // console.log('========field:', field)

  const newArea = produce(area, (draft) => {
    draft.widgets.push(widget)
  })
  queryClient.setQueryData(getQueryKey(areaId), newArea)

  await api.area.updateArea.mutate({
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
  await api.area.updateArea.mutate({
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
  await api.area.updateArea.mutate({
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

  await api.area.updateArea.mutate({
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

  await api.area.updateArea.mutate({
    id: areaId!,
    favorites: newArea.favorites,
  })
}

export async function updateAreaState(areaId: string, data: Partial<Area>) {
  const area = getArea(areaId)
  queryClient.setQueryData(getQueryKey(areaId), {
    ...area,
    ...data,
  })
}

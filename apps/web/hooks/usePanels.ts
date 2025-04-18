import isEqual from 'react-fast-compare'
import { queryClient } from '@/lib/queryClient'
import { Panel, PanelType, Widget } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { produce } from 'immer'

const idbKey = 'PANELS'
const queryKey = ['panels']

export function usePanels() {
  const { data: panels = [], ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      const panels: Panel[] = (await get(idbKey)) || []
      if (!panels.length) {
        const defaultPanels = [
          {
            id: uniqueId(),
            type: PanelType.HOME,
          } as Panel,
        ]
        set(idbKey, defaultPanels)
        return defaultPanels
      }
      return panels
    },
  })
  const isCreationInPanels = (creationId: string) => {
    return panels.some(
      (p) => p.type === PanelType.CREATION && p?.creation?.id === creationId,
    )
  }
  return { panels, ...rest, isCreationInPanels }
}

function getPanels() {
  return (queryClient.getQueryData(queryKey) as Panel[]) || []
}

export async function savePanels(newPanels: Panel[]) {
  queryClient.setQueryData(queryKey, newPanels)
  await set(idbKey, newPanels)
}

export async function updateMainPanel(panel: Panel) {
  let panels = getPanels()

  let index = panels.findIndex((p) => p.type !== PanelType.WIDGET)
  if (index < 0) index = 0

  if (panel.type === PanelType.CREATION) {
    panels = produce(panels, (draft) => {
      draft[index] = panel
      draft[index].isLoading = true
    })
    queryClient.setQueryData(queryKey, panels)
  }

  setTimeout(async () => {
    const newPanels = produce(panels, (draft) => {
      draft[index] = panel
      draft[index].isLoading = false
    })

    await savePanels(newPanels)
  }, 1)
}

export async function openPanel(index: number, panel: Panel) {
  const panels = getPanels()
  const newPanels = produce(panels, (draft) => {
    draft[index] = panel
  })
  await savePanels(newPanels)
}

export async function addPanel(panel: Panel) {
  const panels = getPanels()
  const newPanels = produce(panels, (draft) => {
    if (panels.length === 1) panel.size = 100
    draft.push(panel)
  })
  await savePanels(newPanels)
}

export async function openWidgetPanel(widget: Widget) {
  const panels = getPanels()
  const newPanels = produce(panels, (draft) => {
    draft.unshift({
      id: uniqueId(),
      type: PanelType.WIDGET,
      widget,
    })
  })
  await savePanels(newPanels)
}

export async function closePanel(id: string) {
  const panels = getPanels()
  const newPanels = panels.filter((p) => p.id !== id)
  if (!newPanels.length) {
    newPanels.push({
      id: uniqueId(),
      type: PanelType.HOME,
    })
  }
  await savePanels(newPanels)
}

export async function updatePanels(panels: Panel[]) {
  await savePanels(panels)
}

export async function resetPanels() {
  await savePanels([
    {
      id: uniqueId(),
      type: PanelType.HOME,
    },
  ])
}

export async function updatePanelSizes(sizes: number[]) {
  const panels = getPanels()
  if (sizes.length !== panels.length) return
  const oldSizes = panels.map((p) => p.size)
  if (isEqual(oldSizes, sizes)) {
    return
  }

  const newPanels = produce(panels, (draft) => {
    sizes.forEach((size, index) => {
      draft[index].size = size
    })
  })

  await savePanels(newPanels)
}

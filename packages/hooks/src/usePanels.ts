import isEqual from 'react-fast-compare'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import { useAtom, useAtomValue } from 'jotai'
import { WidgetType } from '@penx/constants'
import { queryClient } from '@penx/query-client'
import { panelsAtom } from '@penx/store'
import { Panel, PanelType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

const PANELS = 'PANELS'
const queryKey = ['panels']

export function usePanels() {
  const panels = useAtomValue(panelsAtom)
  const isCreationInPanels = (creationId: string) => {
    return panels.some(
      (p) => p.type === PanelType.CREATION && p?.creationId === creationId,
    )
  }
  return { panels, isCreationInPanels }
}

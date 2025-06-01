import { useAtomValue } from 'jotai'
import { panelsAtom } from '@penx/store'
import { PanelType } from '@penx/types'

export function usePanels() {
  const panels = useAtomValue(panelsAtom)
  const isCreationInPanels = (creationId: string) => {
    return panels.some(
      (p) => p.type === PanelType.CREATION && p?.creationId === creationId,
    )
  }
  return {
    panels,
    isCreationInPanels,
    journalPanel: panels.find((p) => p.type === PanelType.JOURNAL)!,
  }
}

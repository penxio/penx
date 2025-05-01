'use client'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDebouncedCallback } from 'use-debounce'
import { useCreations } from '@penx/hooks/useCreations'
import { useCreationsContext } from '@penx/contexts/CreationsContext'
import { usePanels } from '@penx/hooks/usePanels'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { ResizablePanelGroup } from '@penx/uikit/resizable'
import { PanelItem } from './PanelItem'

export function PanelList() {
  const { creations } = useCreations()
  const { panels } = usePanels()

  const debouncedUpdateSizes = useDebouncedCallback(async (sizes: number[]) => {
    await store.panels.updatePanelSizes(sizes)
  }, 200)

  return (
    <DndProvider backend={HTML5Backend}>
      <ResizablePanelGroup
        direction="horizontal"
        className=""
        onLayout={(sizes) => {
          // console.log('========sizes:', sizes)
          debouncedUpdateSizes(sizes)
        }}
      >
        {panels
          .filter((p) => {
            if (p.type !== PanelType.CREATION) return true
            if (!p.creationId) return false
            const some = creations.some((c) => c.id === p.creationId)
            if (!some) return false
            return true
          })
          .map((panel, index) => (
            <PanelItem
              key={index}
              index={index}
              panel={panel}
              isLast={index === panels.length - 1}
            />
          ))}
      </ResizablePanelGroup>
    </DndProvider>
  )
}

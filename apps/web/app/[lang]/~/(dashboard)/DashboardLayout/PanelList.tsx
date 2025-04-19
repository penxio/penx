'use client'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ResizablePanelGroup } from '@penx/uikit/ui/resizable'
import { updatePanelSizes, usePanels } from '@/hooks/usePanels'
import { useDebouncedCallback } from 'use-debounce'
import { PanelItem } from './PanelItem'

export function PanelList() {
  const { panels, isLoading } = usePanels()

  const debouncedUpdateSizes = useDebouncedCallback(async (sizes: number[]) => {
    await updatePanelSizes(sizes)
  }, 200)

  if (isLoading) return null

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
        {panels.map((panel, index) => (
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

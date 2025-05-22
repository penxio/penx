'use client'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDebouncedCallback } from 'use-debounce'
import { isMobileApp } from '@penx/constants'
import { useCreationsContext } from '@penx/contexts/CreationsContext'
import { useCreations } from '@penx/hooks/useCreations'
import { usePanels } from '@penx/hooks/usePanels'
import { store } from '@penx/store'
import { Panel, PanelType } from '@penx/types'
import { ResizablePanelGroup } from '@penx/uikit/resizable'
import { PanelItem } from './PanelItem'

interface Props {
  panels?: Panel[]
}

export function PanelList(props: Props) {
  const { creations } = useCreations()
  const { panels } = usePanels()

  const debouncedUpdateSizes = useDebouncedCallback(async (sizes: number[]) => {
    await store.panels.updatePanelSizes(sizes)
  }, 200)

  const panelsJsx = (
    <>
      {(props.panels || panels)
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
    </>
  )

  if (isMobileApp) {
    return <DndProvider backend={HTML5Backend}>{panelsJsx}</DndProvider>
  }

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
        {panelsJsx}
      </ResizablePanelGroup>
    </DndProvider>
  )
}

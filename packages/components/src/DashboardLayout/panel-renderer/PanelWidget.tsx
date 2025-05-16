'use client'

import { useEffect, useRef, useState } from 'react'
import { WidgetType } from '@penx/constants'
import { useMolds } from '@penx/hooks/useMolds'
import { CreationType, Panel, Widget } from '@penx/types'
import { WidgetName } from '@penx/widgets/WidgetName'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'
import { BookmarkList } from './Bookmarks/BookmarkList'
import { CreationList } from './CreationList/CreationList'
import { NoteList } from './Notes/NoteList'
import { PanelChat } from './PanelChat'
import { TasksList } from './Tasks/TasksList'

interface Props {
  panel: Panel
  index: number
}

export function PanelWidget({ panel, index }: Props) {
  const { molds } = useMolds()
  const widget = panel.widget as Widget
  const mold = molds.find((m) => m.id === widget.moldId)!

  const ref = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    if (!ref.current) return
    function updateWidth() {
      if (!ref.current) return
      const newWidth = ref.current.getBoundingClientRect().width

      if (newWidth < 500) {
        setColumns(1)
      } else if (newWidth < 900) {
        setColumns(2)
      } else if (newWidth < 1300) {
        setColumns(3)
      } else {
        setColumns(4)
      }
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [])

  if (mold?.type === CreationType.NOTE) {
    return (
      <div ref={ref} className="flex-1 overflow-x-hidden pt-8">
        <NoteList
          panel={panel}
          index={index}
          mold={mold}
          columnCount={columns}
        />
      </div>
    )
  }

  if (widget.type === WidgetType.AI_CHAT) {
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-8">
        <PanelChat panel={panel} index={index} />
      </div>
    )
  }

  if (mold?.type === CreationType.TASK) {
    return <TasksList panel={panel} index={index} mold={mold} />
  }

  if (mold?.type === CreationType.BOOKMARK) {
    return <BookmarkList panel={panel} index={index} mold={mold} />
  }

  return <CreationList panel={panel} index={index} mold={mold} />
}

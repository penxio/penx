'use client'

import { useMoldsContext } from '@penx/contexts/MoldsContext'
import { getWidgetName } from '@penx/libs/getWidgetName'
import { CreationType, Panel, PanelType, Widget } from '@penx/types'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'
import { ArticleList } from './Articles/ArticleList'
import { BookmarkList } from './Bookmarks/BookmarkList'
import { NoteList } from './Notes/NoteList'
import { TasksList } from './Tasks/TasksList'

interface Props {
  panel: Panel
  index: number
}

export function PanelWidget({ panel, index }: Props) {
  const molds = useMoldsContext()
  const widget = panel.widget as Widget
  const mold = molds.find((m) => m.id === widget.moldId)
  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>{getWidgetName(widget, molds)}</div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-8">
        {mold?.type === CreationType.NOTE && (
          <NoteList panel={panel} index={index} mold={mold} />
        )}

        {mold?.type === CreationType.TASK && (
          <TasksList panel={panel} index={index} mold={mold} />
        )}

        {mold?.type === CreationType.BOOKMARK && (
          <BookmarkList panel={panel} index={index} mold={mold} />
        )}

        {mold?.type === CreationType.ARTICLE && (
          <ArticleList panel={panel} index={index} mold={mold} />
        )}
      </div>
    </>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { WidgetType } from '@penx/constants'
import { useMoldsContext } from '@penx/contexts/MoldsContext'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { CreationType, Panel, PanelType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { WidgetName } from '@penx/widgets/WidgetName'
import { Chat } from '../../AIChat/chat'
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
  const { session } = useSession()
  const { isLoading, data = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const list = await localDB.message
        .where({ siteId: session.siteId })
        .toArray()
      return list.sort((a, b) => {
        if (b.createdAt.getTime() > a.createdAt.getTime()) return -1
        if (a.createdAt.getTime() < b.createdAt.getTime()) return 1
        return b.role.localeCompare(a.role)
      })
    },
  })

  if (isLoading) return null

  const messages = data.map((m) => ({ ...m, content: m.parts[0].text }))

  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>
          <WidgetName widget={widget} molds={molds} />
        </div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-8">
        {widget.type === WidgetType.AI_CHAT && (
          <Chat
            id={uniqueId()}
            // panel={panel}
            // index={index}
            initialMessages={messages}
            session={session}
            selectedChatModel={''}
            selectedVisibilityType="private"
            isReadonly={false}
          />
        )}

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

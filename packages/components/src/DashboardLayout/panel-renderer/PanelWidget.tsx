'use client'

import { WidgetType } from '@penx/constants'
import { useStructs } from '@penx/hooks/useStructs'
import { CreationType, Panel, Widget } from '@penx/types'
import { WidgetName } from '@penx/widgets/WidgetName'
import { FullPageDatabase } from '../../database-ui'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'
import { BookmarkList } from './Bookmarks/BookmarkList'
import { PanelChat } from './PanelChat'

interface Props {
  panel: Panel
  index: number
}

export function PanelWidget({ panel, index }: Props) {
  const { structs } = useStructs()
  const widget = panel.widget as Widget
  const struct = structs.find((m) => m.id === widget.structId)!

  if (widget.type === WidgetType.AI_CHAT) {
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-8">
        <PanelChat panel={panel} index={index} />
      </div>
    )
  }

  // if (struct?.type === CreationType.BOOKMARK) {
  //   return <BookmarkList panel={panel} index={index} struct={struct} />
  // }

  // return <CreationList panel={panel} index={index} struct={struct} />
  return <FullPageDatabase struct={struct} />
}

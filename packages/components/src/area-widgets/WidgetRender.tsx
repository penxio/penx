import { WidgetType } from '@penx/constants'
import { useStructs } from '@penx/hooks/useStructs'
import { Widget } from '@penx/types'
import { AIChatHistorys } from './widgets/AIChatHistorys'
import { AllCreations } from './widgets/AllCreations'
import { CreationList } from './widgets/CreationList'
import { Favorites } from './widgets/Favorites'
import { RecentlyEdited } from './widgets/RecentlyEdited'
import { RecentlyOpened } from './widgets/RecentlyOpened'
import { TaskNavWidget } from './widgets/TaskNavWidget/TaskNavWidget'

interface Props {
  widget: Widget
}
export function WidgetRender({ widget }: Props) {
  const { structs } = useStructs()
  if (widget.type === WidgetType.RECENTLY_EDITED) {
    return <RecentlyEdited />
  }

  if (widget.type === WidgetType.RECENTLY_OPENED) {
    return <RecentlyOpened />
  }

  if (widget.type === WidgetType.FAVORITES) {
    return <Favorites />
  }

  if (widget.type === WidgetType.ALL_CREATIONS) {
    return <AllCreations />
  }

  // if (widget.type === WidgetType.ALL_STRUCTS) {
  //   return <AllStructs />
  // }

  if (widget.type === WidgetType.STRUCT) {
    const struct = structs.find((s) => s.id === widget.structId)
    console.log('======struct:', struct)
    if (struct?.isTask) {
      return <TaskNavWidget struct={struct} />
    }

    return <CreationList widget={widget} />
  }

  if (widget.type === WidgetType.AI_CHAT) {
    return <AIChatHistorys />
  }

  return null
}

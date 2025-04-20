import { WidgetType } from '@penx/constants'
import { Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export const getInitialWidgets = () => {
  const widgets: Widget[] = [
    {
      id: uniqueId(),
      type: WidgetType.ALL_CREATIONS,
    },
    {
      id: uniqueId(),
      type: WidgetType.FAVORITES,
    },
    {
      id: uniqueId(),
      type: WidgetType.RECENTLY_EDITED,
    },
  ]
  return widgets
}

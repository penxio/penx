import { WidgetType } from '@penx/constants'
import { IMold } from '@penx/model-type'
import { CreationType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export const getInitialWidgets = (molds: IMold[]) => {
  const pageMold = molds.find((mold) => mold.type === CreationType.PAGE)!
  const noteMold = molds.find((mold) => mold.type === CreationType.NOTE)!

  const widgets: Widget[] = [
    {
      id: uniqueId(),
      collapsed: true,
      type: WidgetType.AI_CHAT,
    },
    {
      id: uniqueId(),
      collapsed: true,
      type: WidgetType.ALL_CREATIONS,
    },
    {
      id: uniqueId(),
      collapsed: true,
      type: WidgetType.FAVORITES,
    },
    {
      id: uniqueId(),
      collapsed: true,
      type: WidgetType.RECENTLY_EDITED,
    },
    {
      id: uniqueId(),
      type: WidgetType.MOLD,
      collapsed: true,
      moldId: pageMold.id,
    },
    {
      id: uniqueId(),
      type: WidgetType.MOLD,
      collapsed: true,
      moldId: noteMold.id,
    },
  ]
  return widgets
}

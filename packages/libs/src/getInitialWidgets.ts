import { WidgetType } from '@penx/constants'
import { IMoldNode } from '@penx/model-type'
import { CreationType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export const getInitialWidgets = (molds: IMoldNode[]) => {
  const pageMold = molds.find((mold) => mold.props.type === CreationType.PAGE)!
  const noteMold = molds.find((mold) => mold.props.type === CreationType.NOTE)!
  const taskMold = molds.find((mold) => mold.props.type === CreationType.TASK)!

  const widgets: Widget[] = [
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
    {
      id: uniqueId(),
      type: WidgetType.MOLD,
      collapsed: true,
      moldId: taskMold.id,
    },
  ]
  return widgets
}

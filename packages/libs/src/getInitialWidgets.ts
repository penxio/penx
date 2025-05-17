import { WidgetType } from '@penx/constants'
import { IStructNode } from '@penx/model-type'
import { CreationType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export const getInitialWidgets = (structs: IStructNode[]) => {
  const pageStruct = structs.find((struct) => struct.props.type === CreationType.PAGE)!
  const noteStruct = structs.find((struct) => struct.props.type === CreationType.NOTE)!
  const taskStruct = structs.find((struct) => struct.props.type === CreationType.TASK)!

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
      type: WidgetType.STRUCT,
      collapsed: true,
      structId: pageStruct.id,
    },
    {
      id: uniqueId(),
      type: WidgetType.STRUCT,
      collapsed: true,
      structId: noteStruct.id,
    },
    {
      id: uniqueId(),
      type: WidgetType.STRUCT,
      collapsed: true,
      structId: taskStruct.id,
    },
  ]
  return widgets
}

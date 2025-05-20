import { WidgetType } from '@penx/constants'
import { IStructNode } from '@penx/model-type'
import { StructType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export const getInitialWidgets = (structs: IStructNode[]) => {
  const pageStruct = structs.find(
    (struct) => struct.props.type === StructType.PAGE,
  )!
  const noteStruct = structs.find(
    (struct) => struct.props.type === StructType.NOTE,
  )!
  const taskStruct = structs.find(
    (struct) => struct.props.type === StructType.TASK,
  )!

  const widgets: Widget[] = [
    {
      id: uniqueId(),
      collapsed: false,
      type: WidgetType.ALL_STRUCTS,
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

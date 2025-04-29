import { Widget } from '@penx/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WidgetItem } from './WidgetItem'

interface Props {
  id: string
  index: number
  widget: Widget
}

export function SortableItem(props: Props) {
  const { id, index, widget } = props
  const {
    attributes,
    listeners,
    isDragging,
    isSorting,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <WidgetItem
      ref={setNodeRef}
      id={id}
      index={index}
      isDragging={isDragging}
      isSorting={isSorting}
      widget={widget}
      style={style}
      attributes={attributes}
      listeners={listeners}
    ></WidgetItem>
  )
}

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ViewColumn } from '@penx/types'
import { Item } from './Item'

interface Props {
  id: string
  index: number
  viewColumn: ViewColumn
}

export function SortableItem(props: Props) {
  const { id, index, viewColumn } = props
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
    <Item
      ref={setNodeRef}
      id={id}
      index={index}
      isDragging={isDragging}
      isSorting={isSorting}
      viewColumn={viewColumn}
      style={style}
      attributes={attributes}
      listeners={listeners}
    ></Item>
  )
}

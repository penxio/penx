import { CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { ColumnItem } from './ColumnItem'

interface Props {
  id: string
  index: number
  column: IColumn
  struct: Struct
}

export function SortableColumnItem(props: Props) {
  const { id, index, column, struct } = props
  const {
    attributes,
    listeners,
    isDragging,
    isSorting,
    setNodeRef,
    transform,
    transition,
    over,
    active,
    overIndex,
    activeIndex,
  } = useSortable({
    id,
    disabled: index === 0,
    // transition: {
    //   duration: 150, // milliseconds
    //   easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    // },
  })

  function getActiveStyle() {
    // if (!over || !active) return {}
    // if (id === over?.id) {
    if (overIndex > 0 && activeIndex > 0) {
      const isAfter = overIndex > activeIndex
      const style = {
        left: 0,
        right: 0,
        position: 'absolute',
        height: 2,
        width: '100%',
        background: 'red',
      } as CSSProperties
      if (isAfter) style.bottom = -4
      if (!isAfter) style.top = -4

      return style
    }
    return {}
  }

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: 'none',
  }

  return (
    <ColumnItem
      ref={setNodeRef}
      id={id}
      index={index}
      isDragging={isDragging}
      isSorting={isSorting}
      column={column}
      struct={struct}
      style={style}
      attributes={attributes}
      listeners={listeners}
    />
  )
}

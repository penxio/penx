import { CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { isMobileApp } from '@penx/constants'
import { Widget } from '@penx/types'
import { WidgetItem } from './WidgetItem'

interface Props {
  id: string
  index: number
  widget: Widget
}

export function SortableWidgetItem(props: Props) {
  const { id, index, widget } = props
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

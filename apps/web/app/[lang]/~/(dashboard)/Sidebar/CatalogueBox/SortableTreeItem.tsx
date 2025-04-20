import React, { CSSProperties, useState } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Creation } from '@prisma/client'
import { CatalogueItem } from './CatalogueItem'
import { FlattenedItem } from './types'

interface Props {
  depth: number
  overDepth: number // projected depth
  name: string
  item: FlattenedItem
  creation: Creation
  onCollapse?: () => void
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export function SortableTreeItem({
  item,
  creation,
  depth,
  overDepth,
  onCollapse,
  name,
}: Props) {
  const sortable = useSortable({
    id: item.id,
    animateLayoutChanges,
  })
  const {
    over,
    active,
    overIndex,
    activeIndex,
    attributes,
    isDragging,
    isSorting,
    isOver,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    setNodeRef,
    transform,
    transition,
  } = sortable

  const { id } = item

  function getActiveStyle() {
    if (!over || !active) return {}
    if (id !== over.id) return {}
    // if (over.id === active.id) return {}
    if (item.isCategory) return {}

    const isAfter = overIndex > activeIndex
    const style = {
      left: overDepth * 20,
      // left: 0,
      right: 0,
      position: 'absolute',
      height: 2,
      width: '100%',
    } as CSSProperties
    if (isAfter) style.bottom = 0
    if (!isAfter) style.top = 0

    return style
  }

  const style: CSSProperties = {
    transform: isSorting ? undefined : CSS.Translate.toString(transform),
    transition,
  }

  return (
    <CatalogueItem
      ref={sortable.setNodeRef}
      item={item}
      creation={creation}
      name={name}
      dragLine={<div className="bg-brand" style={getActiveStyle()}></div>}
      depth={depth}
      onCollapse={onCollapse}
      listeners={sortable.listeners}
      // level={item.depth}
      sortable={sortable}
      style={style}
    />
  )
}

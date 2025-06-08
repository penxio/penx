'use client'

import React, { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
import { Card } from '@/components/ui/Card'
import {
  closestCenter,
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringConfiguration,
  MeasuringStrategy,
  Modifier,
  MouseSensor,
  PointerSensor,
  SensorContext,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { isMobileApp } from '@penx/constants'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { AddPropertyButton } from './AddPropertyButton'
import { ColumnItem } from './ColumnItem'
import { SortableColumnItem } from './SortableColumnItem'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}
const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

interface Props {
  struct: Struct
}

export const ColumnList = ({ struct }: Props) => {
  const columns = struct.columns

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    // useSensor(PointerSensor, {
    //   activationConstraint: {
    //     delay: isMobileApp ? 100 : 10,
    //     tolerance: 5,
    //   },
    // }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: isMobileApp ? 100 : 10,
        tolerance: 5,
      },
    }),
  )

  const [items, setItems] = useState<string[]>(columns.map((item) => item.id))

  useEffect(() => {
    const newItems = columns.map((item) => item.id)
    if (isEqual(items, newItems)) return
    setItems(newItems)
  }, [columns])

  function handleDragStart({ active }: DragStartEvent) {
    if (active) {
      setActiveId(active.id as string)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = columns.findIndex((i) => i.id === active.id)
      const newIndex = columns.findIndex((i) => i.id === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))

      const newColumns = arrayMove(columns, oldIndex, newIndex)

      store.structs.updateStructProps(struct, {
        columns: newColumns,
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId ? columns.find(({ id }) => id === activeId) : null

  return (
    <Card className="text-foreground flex flex-col">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => {
            const column = columns.find(({ id }) => id === item)
            return (
              <SortableColumnItem
                key={item}
                index={index}
                id={item}
                column={column!}
                struct={struct}
              />
            )
          })}
        </SortableContext>

        {createPortal(
          <DragOverlay adjustScale={false} dropAnimation={dropAnimationConfig}>
            {activeId && activeItem && (
              <ColumnItem
                dragOverlay
                struct={struct}
                column={activeItem}
                id={activeId}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      <AddPropertyButton struct={struct} />
    </Card>
  )
}

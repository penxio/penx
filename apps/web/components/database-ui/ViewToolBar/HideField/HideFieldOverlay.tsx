'use client'

import React, { FC, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  defaultDropAnimation,
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
import { useDatabaseContext } from '../../DatabaseProvider'
import { SortableItem } from './SortableItem'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export const HideFieldOverlay = () => {
  const { currentView, sortColumns: moveColumn } = useDatabaseContext()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  let { viewColumns = [] } = currentView

  const [items, setItems] = useState<string[]>(
    viewColumns.map((field) => field.columnId),
  )

  function handleDragStart({ active }: DragStartEvent) {
    if (active) {
      setActiveId(active.id as string)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = viewColumns.findIndex((i) => i.columnId === active.id)
      const newIndex = viewColumns.findIndex((i) => i.columnId === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))
      moveColumn(oldIndex, newIndex)
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId
    ? viewColumns.find(({ columnId: id }) => id === activeId)
    : null

  return (
    <div className="bg-background flex w-[200px] flex-col rounded">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {viewColumns.map((viewColumn, index) => (
            <SortableItem
              key={viewColumn.columnId}
              index={index}
              id={viewColumn.columnId}
              viewColumn={viewColumn}
            />
          ))}
        </SortableContext>

        {/* {createPortal(
          <DragOverlay>
            {activeId && activeItem && (
              <Item dragOverlay viewColumn={activeItem} id={activeId} />
            )}
          </DragOverlay>,
          document.body,
        )} */}
      </DndContext>
      {/* <Box toBetween mt2>
        <Button size={28}>Hide all</Button>
        <Button size={28}>Show all</Button>
      </Box> */}
    </div>
  )
}

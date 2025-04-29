'use client'

import React, { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
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
import { useAreaContext } from '@penx/components/AreaContext'
import { updateArea, updateAreaState } from '@penx/hooks/useArea'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { Widget } from '@penx/types'
import { WidgetItem } from './WidgetItem'
import { SortableItem } from './SortableItem'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export const WidgetList = () => {
  const area = useAreaContext()
  const widgets = (area?.widgets || []) as Widget[]
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [items, setItems] = useState<string[]>(widgets.map((item) => item.id))

  useEffect(() => {
    const newItems = widgets.map((item) => item.id)
    if (isEqual(items, newItems)) return
    setItems(newItems)
  }, [area])

  function handleDragStart({ active }: DragStartEvent) {
    if (active) {
      setActiveId(active.id as string)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((i) => i.id === active.id)
      const newIndex = widgets.findIndex((i) => i.id === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))

      const newWidgets = arrayMove(widgets, oldIndex, newIndex)

      updateArea({
        id: area.id!,
        widgets: newWidgets,
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId ? widgets.find(({ id }) => id === activeId) : null

  return (
    <div className="flex flex-col gap-2">
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
            const widget = widgets.find(({ id }) => id === item)
            return (
              <SortableItem
                key={item}
                index={index}
                id={item}
                widget={widget!}
              />
            )
          })}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeId && activeItem && (
              <WidgetItem dragOverlay widget={activeItem} id={activeId} />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  )
}

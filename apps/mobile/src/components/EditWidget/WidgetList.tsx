'use client'

import React, { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
import { impact } from '@/lib/impact'
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
import { useArea } from '@penx/hooks/useArea'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Card } from '../ui/Card'
import { SortableWidgetItem } from './SortableWidgetItem'
import { WidgetItem } from './WidgetItem'

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

export const WidgetList = () => {
  const { area } = useArea()
  const widgets = (area?.widgets || []) as Widget[]
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: isMobileApp ? 100 : 10,
        tolerance: 5,
      },
    }),
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

  const [items, setItems] = useState<string[]>(widgets.map((item) => item.id))

  // useEffect(() => {
  //   const newItems = widgets.map((item) => item.id)
  //   if (isEqual(items, newItems)) return
  //   setItems(newItems)
  // }, [area])

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

      store.area.updateArea({
        id: area.id!,
        widgets: newWidgets,
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const handleDragOver = async (event: DragOverEvent) => {
    await impact()
  }

  const activeItem = activeId ? widgets.find(({ id }) => id === activeId) : null

  return (
    <Card className="text-foreground flex flex-col">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => {
            const widget = widgets.find(({ id }) => id === item)
            return (
              <SortableWidgetItem
                key={item}
                index={index}
                id={item}
                widget={widget!}
              />
            )
          })}
        </SortableContext>

        {createPortal(
          <DragOverlay adjustScale={false} dropAnimation={dropAnimationConfig}>
            {activeId && activeItem && (
              <WidgetItem dragOverlay widget={activeItem} id={activeId} />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </Card>
  )
}

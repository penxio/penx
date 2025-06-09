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
import { produce } from 'immer'
import { isMobileApp } from '@penx/constants'
import { Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { AddOptionButton } from './AddOptionButton'
import { OptionItem } from './OptionItem'
import { SortableOptionItem } from './SortableOptionItem'

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
  column: IColumn
}

export const OptionList = ({ struct, column }: Props) => {
  const options = column.options || []

  console.log('=========options:', options)

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

  const [items, setItems] = useState<string[]>(options.map((item) => item.id))

  useEffect(() => {
    const newItems = options.map((item) => item.id)
    if (isEqual(items, newItems)) return
    setItems(newItems)
  }, [options])

  function handleDragStart({ active }: DragStartEvent) {
    if (active) {
      setActiveId(active.id as string)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = options.findIndex((i) => i.id === active.id)
      const newIndex = options.findIndex((i) => i.id === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))

      const newOptions = arrayMove(options, oldIndex, newIndex)

      const newColumns = produce(struct.columns, (draft) => {
        const index = draft.findIndex((c) => c.id === column.id)
        draft[index].options = newOptions
      })

      store.structs.updateStructProps(struct, {
        columns: newColumns,
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId ? options.find(({ id }) => id === activeId) : null

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
            const option = options.find(({ id }) => id === item)
            return (
              <SortableOptionItem
                key={item}
                index={index}
                id={item}
                option={option!}
                column={column}
                struct={struct}
              />
            )
          })}
        </SortableContext>

        {createPortal(
          <DragOverlay adjustScale={false} dropAnimation={dropAnimationConfig}>
            {activeId && activeItem && (
              <OptionItem
                dragOverlay
                struct={struct}
                option={activeItem}
                column={column}
                id={activeId}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      <AddOptionButton struct={struct} />
    </Card>
  )
}

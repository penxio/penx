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
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Trans } from '@lingui/react'
import { defaultNavLinks } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { updateSiteState, useQuerySite } from '@penx/hooks/useQuerySite'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import { NavLink, Widget } from '@penx/types'
import { Item } from './Item'
import { NavLinkDialog } from './NavLinkDialog/NavLinkDialog'
import { SortableItem } from './SortableItem'

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

export const NavigationList = () => {
  const { site } = useQuerySite()
  let navLinks = (site.navLinks || defaultNavLinks) as NavLink[]
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

  const [items, setItems] = useState<string[]>(
    navLinks.map((item) => item.pathname),
  )

  useEffect(() => {
    const newItems = navLinks.map((item) => item.pathname)
    if (isEqual(items, newItems)) return
    setItems(newItems)
  }, [navLinks])

  function handleDragStart({ active }: DragStartEvent) {
    if (active) {
      setActiveId(active.id as string)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = navLinks.findIndex((i) => i.pathname === active.id)
      const newIndex = navLinks.findIndex((i) => i.pathname === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))

      const newNavLinks = arrayMove(navLinks, oldIndex, newIndex)
      updateSiteState({
        navLinks: newNavLinks,
      })

      await api.site.updateSite.mutate({
        id: site.id,
        navLinks: newNavLinks,
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId
    ? navLinks.find(({ pathname }) => pathname === activeId)
    : null

  return (
    <div>
      <NavLinkDialog />
      <div className="flex flex-col gap-1">
        <div className="text-foreground/60 flex text-sm">
          <div className="flex-1">
            <div className="pl-7">
              <Trans id="Title"></Trans>
            </div>
          </div>
          <div className="flex-1">
            <Trans id="Type"></Trans>
          </div>
          <div className="flex-1">
            <Trans id="Location"></Trans>
          </div>
          <div className="flex-1">
            <Trans id="Path"></Trans>
          </div>
          <div className="flex-1">
            <Trans id="Operation"></Trans>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={measuring}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, index) => {
                const navLink = navLinks.find(
                  ({ pathname }) => pathname === item,
                )
                return (
                  <SortableItem
                    key={item}
                    index={index}
                    id={item}
                    navLink={navLink!}
                  />
                )
              })}
            </SortableContext>

            {createPortal(
              <DragOverlay>
                {activeId && activeItem && (
                  <Item
                    dragOverlay
                    navLink={activeItem}
                    id={activeId}
                    index={0}
                  />
                )}
              </DragOverlay>,
              document.body,
            )}
          </DndContext>
        </div>
      </div>
    </div>
  )
}

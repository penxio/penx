'use client'

import React, { forwardRef, useState } from 'react'
import { useAreaContext } from '@/components/AreaContext'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useAddCreation } from '@/hooks/useAddCreation'
import { toggleCollapsed } from '@/hooks/useAreaItem'
import { openWidgetPanel } from '@/hooks/usePanels'
import { WidgetType } from '@/lib/constants'
import { getWidgetName } from '@/lib/getWidgetName'
import { Widget } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react/macro'
import { AnimatePresence, motion } from 'motion/react'
import { AddCreationButton } from './AddCreationButton'
import { AllCreationCard } from './AllCreationCard'
import { IsAllProvider } from './IsAllContext'
import { TitleContextMenu } from './TitleContextMenu'
import { ToggleButton } from './ToggleButton'
import { WidgetRender } from './WidgetRender'

interface Props {
  dragging?: boolean
  dragOverlay?: boolean
  isDragging?: boolean
  isSorting?: boolean

  /** for drag handle */
  listeners?: DraggableSyntheticListeners

  /** for drag handle */
  attributes?: any

  id: string

  index?: number

  style?: any

  widget: Widget
}

export const Item = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const {
      widget,
      index,
      id,
      dragOverlay,
      isDragging,
      isSorting,
      attributes,
      listeners,
      ...rest
    } = props

    const { molds } = useSiteContext()
    const field = useAreaContext()
    const [visible, setVisible] = useState(false)

    if (!widget) return null

    const name = getWidgetName(widget, molds)

    return (
      <>
        <AllCreationCard
          name={name}
          visible={visible}
          setVisible={setVisible}
          widget={widget}
        />

        <div
          ref={ref}
          className={cn(
            'bg-background shadow-2xs group/widget flex flex-col rounded-md dark:bg-[#181818]',
            isDragging && 'bg-foreground/6 opacity-50',
            isDragging && 'z-[1000000]',
            dragOverlay && 'shadow',
          )}
          {...rest}
        >
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className="flex h-10 cursor-pointer items-center justify-between pl-3 pr-2"
                {...attributes}
                {...listeners}
                onClick={() => {
                  setVisible(!visible)
                }}
              >
                <div className="select-none text-sm font-semibold">{name}</div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover/widget:opacity-100">
                  {widget.type === WidgetType.MOLD && (
                    <AddCreationButton area={field} widget={widget} />
                  )}

                  <ToggleButton area={field} widget={widget} />
                </div>
              </div>
            </ContextMenuTrigger>
            <TitleContextMenu
              widget={widget}
              onShowAll={() => setVisible(!visible)}
              onOpenInPanel={() => {
                openWidgetPanel(widget)
              }}
            />
          </ContextMenu>
          <AnimatePresence initial={false}>
            {!widget.collapsed ? (
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
              >
                <IsAllProvider>
                  <WidgetRender widget={widget} />
                </IsAllProvider>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </>
    )
  },
)

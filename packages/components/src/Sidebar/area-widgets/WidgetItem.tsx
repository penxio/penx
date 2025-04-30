'use client'

import React, { forwardRef, memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useAreaContext } from '@penx/components/AreaContext'
import { WidgetType } from '@penx/constants'
import { useMolds } from '@penx/hooks/useMolds'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@penx/uikit/context-menu'
import { cn } from '@penx/utils'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'
import { WidgetName } from '@penx/widgets/WidgetName'
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

export const WidgetItem = memo(
  forwardRef<HTMLDivElement, Props>(function Item(props, ref) {
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

    const { molds } = useMolds()
    const area = useAreaContext()
    const [visible, setVisible] = useState(false)

    if (!widget) return null

    return (
      <>
        <AllCreationCard
          name={<WidgetName widget={widget} molds={molds} />}
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
                  if (widget.type === WidgetType.AI_CHAT) {
                    store.panels.openWidgetPanel(widget)
                    return
                  }
                  setVisible(!visible)
                }}
              >
                <div className="flex items-center gap-1">
                  <WidgetIcon type={widget.type} molds={molds} />
                  <div className="select-none text-sm font-semibold">
                    <WidgetName widget={widget} molds={molds} />
                  </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover/widget:opacity-100">
                  {widget.type === WidgetType.MOLD && (
                    <AddCreationButton area={area} widget={widget} />
                  )}

                  <ToggleButton area={area} widget={widget} />
                </div>
              </div>
            </ContextMenuTrigger>
            <TitleContextMenu
              widget={widget}
              onShowAll={() => setVisible(!visible)}
              onOpenInPanel={() => {
                store.panels.openWidgetPanel(widget)
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
  }),
  (prev, next) => {
    return isEqual(
      {
        id: prev.id,
        index: prev.index,
        widgets: prev.widget,
        isDragging: prev.isDragging,
        isSorting: prev.isSorting,
      },
      {
        id: next.id,
        index: next.index,
        widgets: next.widget,
        isDragging: next.isDragging,
        isSorting: next.isSorting,
      },
    )
  },
)

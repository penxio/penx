'use client'

import React, { forwardRef, memo, ReactNode, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react'
import {
  GripHorizontalIcon,
  GripVerticalIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Drawer } from 'vaul'
import { isMobileApp, WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
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
import { AddCreationButton } from '../AddCreationButton'
import { AllCreationCard } from '../AllCreationCard'
import { IsAllContext, IsAllProvider } from '../IsAllContext'
import { TitleContextMenu } from '../TitleContextMenu'
import { ToggleButton } from '../ToggleButton'
import { WidgetRender } from '../WidgetRender'

interface Props {
  dragging?: boolean
  dragOverlay?: boolean
  isDragging?: boolean
  isSorting?: boolean
  dragLine?: ReactNode

  /** for drag handle */
  listeners?: DraggableSyntheticListeners

  /** for drag handle */
  attributes?: any

  id: string

  index?: number

  style?: any

  widget: Widget
}

export const WidgetItem = forwardRef<HTMLDivElement, Props>(
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
      dragLine,
      ...rest
    } = props

    const { molds } = useMolds()
    const { area } = useArea()
    const [visible, setVisible] = useState(false)

    // useEffect(() => {
    //   if (!dragOverlay) {
    //     return
    //   }

    //   document.body.style.cursor = 'grabbing'

    //   return () => {
    //     document.body.style.cursor = ''
    //   }
    // }, [dragOverlay])

    if (!widget) return null

    return (
      <>
        <div
          ref={ref}
          className={cn(
            'shadow-2xs group/widget relative flex flex-col rounded-md bg-white dark:bg-[#181818]',
            isDragging && 'bg-foreground/6 opacity-50',
            isDragging && 'z-[1000000]',
            dragOverlay && 'shadow',
          )}
          {...rest}
        >
          <div
            className={cn(
              'relative flex h-10 cursor-pointer select-none items-center justify-between pl-3 pr-0',
              isMobileApp && 'h-11',
            )}
            onClick={() => {
              if (isMobileApp) {
                setVisible(true)
                return
              }

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
            <div className={cn('flex items-center gap-0.5')}>
              <Button
                variant="ghost"
                size="icon"
                className=""
                onClick={() => {
                  store.area.removeWidget(widget.id)
                }}
              >
                <XIcon size={16} />
              </Button>

              <div
                className="inline-flex"
                onTouchStart={async (e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                onPointerDown={async (e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className=""
                  {...attributes}
                  {...listeners}
                >
                  <GripHorizontalIcon size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  },
)

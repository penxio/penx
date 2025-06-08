'use client'

import React, { forwardRef, memo, ReactNode, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react/macro'
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
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'
import { WidgetName } from '@penx/widgets/WidgetName'

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

    const { structs } = useStructs()

    if (!widget) return null

    return (
      <div
        ref={ref}
        className={cn(
          'group/widget relative flex flex-col',
          isDragging && 'bg-foreground/6 opacity-50',
          isDragging && 'z-[1000000]',
          dragOverlay &&
            'text-foreground rounded-md bg-white shadow dark:bg-neutral-700',
        )}
        {...rest}
      >
        <div
          className={cn(
            'relative flex h-11 cursor-pointer select-none items-center justify-between pl-3 pr-0',
          )}
        >
          <div className="flex items-center gap-1">
            <span
              className="icon-[ic--round-remove-circle] mr-1 size-6 text-red-500"
              onClick={async () => {
                store.area.removeWidget(widget.id)
              }}
            ></span>
            <WidgetIcon type={widget.type} structs={structs} />
            <div className="select-none text-sm font-semibold">
              <WidgetName widget={widget} structs={structs} />
            </div>
          </div>

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
              <div>
                <span className="icon-[system-uicons--drag] text-foreground/60 size-6"></span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    )
  },
)

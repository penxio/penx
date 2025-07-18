'use client'

import React, { forwardRef, useState } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { GripVerticalIcon } from 'lucide-react'
import { ViewColumn } from '@penx/types'
import { Switch } from '@penx/uikit/switch'
import { cn } from '@penx/utils'
import { useDatabaseContext } from '../../../DatabaseProvider'
import { FieldIcon } from '../../../FieldIcon'

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

  viewColumn: ViewColumn
}

export const Item = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const { currentView, updateViewColumn, struct } = useDatabaseContext()
    const {
      viewColumn,
      index,
      id,
      dragOverlay,
      isDragging,
      isSorting,
      attributes,
      listeners,
      ...rest
    } = props
    const { columns } = struct
    const column = columns.find((i) => i.id === viewColumn.columnId)!
    const [visible, setVisible] = useState(props.viewColumn.visible)

    async function toggleVisible(visible: boolean) {
      setVisible(visible)
      await updateViewColumn(viewColumn.columnId, { visible })
    }

    return (
      <div
        ref={ref}
        key={viewColumn.columnId}
        className={cn(
          'bg-background flex items-center justify-between rounded p-2',
          // isDragging && 'shadow',
          // isDragging && 'z-[1000000]',
          isDragging && 'bg-foreground/6 opacity-50',
          dragOverlay && 'z-[1000000] shadow',
        )}
        {...rest}
      >
        <div className="flex items-center gap-1">
          <Switch
            size="sm"
            disabled={index === 0}
            checked={visible}
            onCheckedChange={(checked) => {
              toggleVisible(checked)
            }}
          />
          <FieldIcon size={16} columnType={column.columnType as any} />
          <div className="text-foreground/90 text-sm">{column.name}</div>
        </div>

        <GripVerticalIcon
          className={cn(index !== 0 && 'cursor-pointer')}
          size={16}
          {...attributes}
          {...(index === 0 ? {} : listeners)}
        />
      </div>
    )
  },
)

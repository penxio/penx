import React, { forwardRef, ReactNode, useState } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { t } from '@lingui/core/macro'
import { EllipsisIcon, GripVerticalIcon } from 'lucide-react'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { FieldIcon } from '@penx/components/FieldIcon'
import { Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useStructPropDrawer } from './useStructPropDrawer'

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

  column: IColumn
  struct: Struct
}

export const ColumnItem = forwardRef<HTMLDivElement, Props>(function Item(
  props: Props,
  ref,
) {
  const {
    column,
    struct,
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

  const { setState } = useStructPropDrawer()
  if (!column) return null

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col',
        isDragging && 'bg-foreground/6 z-10 rounded-md opacity-60',
        dragOverlay &&
          'text-foreground z-50 rounded-md bg-white opacity-100 shadow dark:bg-neutral-700',
      )}
      {...rest}
    >
      <div
        className={cn(
          'relative flex h-9 select-none items-center justify-between pr-1',
        )}
      >
        <div className="flex items-center gap-2 px-2">
          <div
            className={cn(
              'inline-flex',
              index === 0 && 'disabled cursor-not-allowed',
            )}
          >
            <div className="" {...attributes} {...listeners}>
              <GripVerticalIcon className="text-foreground/50 size-5" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <FieldIcon columnType={column.columnType} />
            <div className="text-sm">{column.name}</div>
            <ColumnTypeName
              className="border-foreground/10 text-foreground/50 flex h-5 items-center rounded-md border px-1 text-xs"
              columnType={column.columnType}
            />
          </div>
        </div>
        {/* <ColumnMenuPopover column={column} index={index!} /> */}

        <Button
          variant="ghost"
          className=" hover:bg-foreground/10 size-7 rounded-md"
          size="icon"
          onClick={() => {
            setState({
              index: index!,
              open: true,
              column,
            })
          }}
        >
          <EllipsisIcon className="text-foreground/40 size-5" />
        </Button>
      </div>
    </div>
  )
})

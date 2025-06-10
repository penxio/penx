import React, { forwardRef, ReactNode } from 'react'
import { Dialog } from '@capacitor/dialog'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { t } from '@lingui/core/macro'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { FieldIcon } from '@penx/components/FieldIcon'
import { Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useEditPropertyDrawer } from './EditPropertyDrawer/useEditPropertyDrawer'

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

  const { setState } = useEditPropertyDrawer()

  if (!column) return null

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col',
        isDragging && 'bg-foreground/6 opacity-50',
        isDragging && 'z-[1000000]',
        dragOverlay &&
          'text-foreground rounded-md bg-white shadow dark:bg-neutral-700',
      )}
      {...rest}
      onClick={() => {
        setState({
          isOpen: true,
          column: column,
        })
      }}
    >
      <div
        className={cn(
          'relative flex h-11 cursor-pointer select-none items-center justify-between pr-0',
        )}
      >
        <div className="flex items-center gap-2 px-2">
          <span
            className={cn(
              'icon-[ic--round-remove-circle] size-6 text-red-500',
              index === 0 && 'opacity-40',
            )}
            onClick={async (e) => {
              e.stopPropagation()
              if (index === 0) return
              const { value } = await Dialog.confirm({
                title: t`Delete this property?`,
                message: t`This action cannot be undone. Are you sure you want to delete this property?`,
              })

              if (value) {
                await store.structs.deleteColumn(struct, column.id)
              }
            }}
          ></span>
          <div className="flex items-center gap-1">
            <FieldIcon columnType={column.columnType} />
            <ColumnTypeName
              className="w-28 text-sm"
              columnType={column.columnType}
            />
          </div>
          <div>{column.name}</div>
        </div>

        {index !== 0 && (
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
        )}
      </div>
    </div>
  )
})

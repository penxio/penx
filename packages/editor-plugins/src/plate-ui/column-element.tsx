'use client'

import * as React from 'react'
import { Button } from './button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'
import { cn } from '@penx/utils'
import { useComposedRef } from '@udecode/cn'
import { PathApi } from '@udecode/plate'
import { useDraggable, useDropLine } from '@udecode/plate-dnd'
import type { TColumnElement } from '@udecode/plate-layout'
import { ResizableProvider } from '@udecode/plate-resizable'
import { BlockSelectionPlugin } from '@udecode/plate-selection/react'
import type { PlateElementProps } from '@udecode/plate/react'
import {
  PlateElement,
  usePluginOption,
  useReadOnly,
  withHOC,
} from '@udecode/plate/react'
import { GripHorizontal } from 'lucide-react'

export const ColumnElement = withHOC(
  ResizableProvider,
  function ColumnElement(props: PlateElementProps<TColumnElement>) {
    const { width } = props.element
    const readOnly = useReadOnly()
    const isSelectionAreaVisible = usePluginOption(
      BlockSelectionPlugin,
      'isSelectionAreaVisible',
    )

    const { isDragging, previewRef, handleRef } = useDraggable({
      element: props.element,
      orientation: 'horizontal',
      type: 'column',
      canDropNode: ({ dragEntry, dropEntry }) =>
        PathApi.equals(
          PathApi.parent(dragEntry[1]),
          PathApi.parent(dropEntry[1]),
        ),
    })

    return (
      <div className="group/column relative" style={{ width: width ?? '100%' }}>
        {!readOnly && !isSelectionAreaVisible && (
          <div
            ref={handleRef}
            className={cn(
              'absolute left-1/2 top-2 z-50 -translate-x-1/2 -translate-y-1/2',
              'pointer-events-auto flex items-center',
              'opacity-0 transition-opacity group-hover/column:opacity-100',
            )}
          >
            <ColumnDragHandle />
          </div>
        )}

        <PlateElement
          {...props}
          ref={useComposedRef(props.ref, previewRef)}
          className="h-full px-2 pt-2 group-first/column:pl-0 group-last/column:pr-0"
        >
          <div
            className={cn(
              'relative h-full border border-transparent p-1.5',
              !readOnly && 'border-border rounded-lg border-dashed',
              isDragging && 'opacity-50',
            )}
          >
            {props.children}

            {!readOnly && !isSelectionAreaVisible && <DropLine />}
          </div>
        </PlateElement>
      </div>
    )
  },
)

const ColumnDragHandle = React.memo(function ColumnDragHandle() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="h-5 !px-1">
            <GripHorizontal
              className="text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
              }}
            />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Drag to move column</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

function DropLine() {
  const { dropLine } = useDropLine({ orientation: 'horizontal' })

  if (!dropLine) return null

  return (
    <div
      className={cn(
        'slate-dropLine',
        'bg-brand/50 absolute',
        dropLine === 'left' &&
          'inset-y-0 left-[-10.5px] w-1 group-first/column:-left-1',
        dropLine === 'right' &&
          'inset-y-0 right-[-11px] w-1 group-last/column:-right-1',
      )}
    />
  )
}

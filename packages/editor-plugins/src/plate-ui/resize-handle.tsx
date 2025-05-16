'use client'

import * as React from 'react'
import { cn } from '@penx/utils'
import {
  Resizable as ResizablePrimitive,
  useResizeHandle,
  useResizeHandleState,
  type ResizeHandle as ResizeHandlePrimitive,
} from '@udecode/plate-resizable'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const mediaResizeHandleVariants = cva(
  cn(
    'top-0 flex w-6 select-none flex-col justify-center',
    "after:bg-ring after:flex after:h-16 after:w-[3px] after:rounded-[6px] after:opacity-0 after:content-['_'] group-hover:after:opacity-100",
  ),
  {
    variants: {
      direction: {
        left: '-left-3 -ml-3 pl-3',
        right: '-right-3 -mr-3 items-end pr-3',
      },
    },
  },
)

const resizeHandleVariants = cva(cn('absolute z-40'), {
  variants: {
    direction: {
      bottom: 'w-full cursor-row-resize',
      left: 'h-full cursor-col-resize',
      right: 'h-full cursor-col-resize',
      top: 'w-full cursor-row-resize',
    },
  },
})

export function ResizeHandle({
  className,
  direction,
  options,
  ...props
}: React.ComponentProps<typeof ResizeHandlePrimitive> &
  VariantProps<typeof resizeHandleVariants>) {
  const state = useResizeHandleState(options ?? {})
  const resizeHandle = useResizeHandle(state)

  if (state.readOnly) return null

  return (
    <div
      className={cn(resizeHandleVariants({ direction }), className)}
      data-resizing={state.isResizing}
      {...resizeHandle.props}
      {...props}
    />
  )
}

const resizableVariants = cva('', {
  variants: {
    align: {
      center: 'mx-auto',
      left: 'mr-auto',
      right: 'ml-auto',
    },
  },
})

export function Resizable({
  align,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive> &
  VariantProps<typeof resizableVariants>) {
  return (
    <ResizablePrimitive
      {...props}
      className={cn(resizableVariants({ align }), className)}
    />
  )
}

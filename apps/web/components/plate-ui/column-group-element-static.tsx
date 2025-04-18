import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'

export function ColumnGroupElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  return (
    <SlateElement className={cn(className, 'mb-2')} {...props}>
      <div className={cn('flex size-full rounded')}>{children}</div>
    </SlateElement>
  )
}

'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'

export function DateElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  const { element } = props
  return (
    <SlateElement as="div" className={cn(className, 'inline-block')} {...props}>
      <div
        className={cn('bg-muted text-muted-foreground w-fit rounded-sm px-1')}
      >
        {element.date ? (element.date as any) : <span>Pick a date</span>}
      </div>
      {children}
    </SlateElement>
  )
}

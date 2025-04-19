import React from 'react'
import { getBlockClassName } from '@penx/utils'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'

export const ParagraphElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  return (
    <SlateElement
      className={cn(
        className,
        'text-foreground/85 m-0 px-0 py-2 leading-relaxed',
        getBlockClassName(props),
      )}
      {...props}
    >
      {children}
    </SlateElement>
  )
}

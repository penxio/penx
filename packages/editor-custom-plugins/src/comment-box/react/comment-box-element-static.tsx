'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { useCreationContext } from '@penx/contexts/CreationContext'
import { CommentWidget } from '@penx/widgets/CommentWidget/CommentWidget'

export const CommentBoxElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const creation = useCreationContext()

  return (
    <SlateElement className={cn(className, 'm-0 px-0 py-1')} {...props}>
      <CommentWidget creationId={creation.id} isInPage={false} />
      {children}
    </SlateElement>
  )
}

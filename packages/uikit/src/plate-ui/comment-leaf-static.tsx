import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateLeafProps } from '@udecode/plate'
import { SlateLeaf } from '@udecode/plate'
import type { TCommentText } from '@udecode/plate-comments'

export function CommentLeafStatic({
  children,
  className,
  ...props
}: SlateLeafProps<TCommentText>) {
  return (
    <SlateLeaf
      className={cn(
        className,
        'border-b-highlight/35 bg-highlight/15 border-b-2',
      )}
      {...props}
    >
      <>{children}</>
    </SlateLeaf>
  )
}

import * as React from 'react'
import type { SlateLeafProps } from '@udecode/plate'
import { SlateLeaf } from '@udecode/plate'
import type { TCommentText } from '@udecode/plate-comments'

export function CommentLeafStatic(props: SlateLeafProps<TCommentText>) {
  return (
    <SlateLeaf
      {...props}
      className="border-b-highlight/35 bg-highlight/15 border-b-2"
    >
      {props.children}
    </SlateLeaf>
  )
}

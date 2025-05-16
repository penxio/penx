'use client'

import * as React from 'react'
import { commentsPlugin } from '../plugins/comments-plugin'
import { cn } from '@penx/utils'
import type { TCommentText } from '@udecode/plate-comments'
import { getCommentCount } from '@udecode/plate-comments'
import type { PlateLeafProps } from '@udecode/plate/react'
import {
  PlateLeaf,
  useEditorPlugin,
  usePluginOption,
} from '@udecode/plate/react'

export function CommentLeaf(props: PlateLeafProps<TCommentText>) {
  const { children, leaf } = props

  const { api, setOption } = useEditorPlugin(commentsPlugin)
  const hoverId = usePluginOption(commentsPlugin, 'hoverId')
  const activeId = usePluginOption(commentsPlugin, 'activeId')

  const isOverlapping = getCommentCount(leaf) > 1
  const currentId = api.comment.nodeId(leaf)
  const isActive = activeId === currentId
  const isHover = hoverId === currentId

  return (
    <PlateLeaf
      {...props}
      className={cn(
        'border-b-highlight/[.36] bg-highlight/[.13] border-b-2 transition-colors duration-200',
        (isHover || isActive) && 'border-b-highlight bg-highlight/25',
        isOverlapping && 'border-b-highlight/[.7] bg-highlight/25 border-b-2',
        (isHover || isActive) &&
          isOverlapping &&
          'border-b-highlight bg-highlight/45',
      )}
      attributes={{
        ...props.attributes,
        onClick: () => setOption('activeId', currentId ?? null),
        onMouseEnter: () => setOption('hoverId', currentId ?? null),
        onMouseLeave: () => setOption('hoverId', null),
      }}
    >
      {children}
    </PlateLeaf>
  )
}

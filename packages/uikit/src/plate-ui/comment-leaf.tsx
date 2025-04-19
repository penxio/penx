'use client'

import React from 'react'
import { commentsPlugin } from '@penx/uikit/editor/plugins/comments-plugin'
import { cn } from '@udecode/cn'
import { getCommentCount, type TCommentText } from '@udecode/plate-comments'
import {
  PlateLeaf,
  useEditorPlugin,
  usePluginOption,
  type PlateLeafProps,
} from '@udecode/plate/react'

export function CommentLeaf({
  className,
  ...props
}: PlateLeafProps<TCommentText>) {
  const { children, leaf, nodeProps } = props

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
        className,
      )}
      onClick={() => setOption('activeId', currentId ?? null)}
      onMouseEnter={() => setOption('hoverId', currentId ?? null)}
      onMouseLeave={() => setOption('hoverId', null)}
      nodeProps={{
        ...nodeProps,
      }}
    >
      {children}
    </PlateLeaf>
  )
}

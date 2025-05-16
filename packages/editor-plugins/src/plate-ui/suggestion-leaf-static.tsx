import * as React from 'react'
import { cn } from '@penx/utils'
import type { SlateLeafProps } from '@udecode/plate'
import { SlateLeaf } from '@udecode/plate'
import type { TSuggestionText } from '@udecode/plate-suggestion'
import { BaseSuggestionPlugin } from '@udecode/plate-suggestion'
import { useEditorPlugin } from '@udecode/plate/react'

export function SuggestionLeafStatic(props: SlateLeafProps<TSuggestionText>) {
  const { api } = useEditorPlugin(BaseSuggestionPlugin)
  const leaf = props.leaf

  const dataList = api.suggestion.dataList(leaf)
  const hasRemove = dataList.some((data) => data.type === 'remove')
  const diffOperation = { type: hasRemove ? 'delete' : 'insert' } as const

  const Component = ({ delete: 'del', insert: 'ins', update: 'span' } as const)[
    diffOperation.type
  ]

  return (
    <SlateLeaf
      {...props}
      as={Component}
      className={cn(
        'border-b-brand/[.24] bg-brand/[.08] text-brand/80 border-b-2 no-underline transition-colors duration-200',
        hasRemove &&
          'border-b-gray-300 bg-gray-300/25 text-gray-400 line-through',
      )}
    >
      {props.children}
    </SlateLeaf>
  )
}

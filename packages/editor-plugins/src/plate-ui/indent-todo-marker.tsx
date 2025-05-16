'use client'

import * as React from 'react'
import { Checkbox } from './checkbox'
import { cn } from '@penx/utils'
import type { SlateRenderElementProps } from '@udecode/plate'
import {
  useIndentTodoListElement,
  useIndentTodoListElementState,
} from '@udecode/plate-indent-list/react'
import { useReadOnly } from '@udecode/plate/react'

export function TodoMarker(props: Omit<SlateRenderElementProps, 'children'>) {
  const state = useIndentTodoListElementState({ element: props.element })
  const { checkboxProps } = useIndentTodoListElement(state)
  const readOnly = useReadOnly()

  return (
    <div contentEditable={false}>
      <Checkbox
        className={cn(
          'absolute -left-6 top-1',
          readOnly && 'pointer-events-none',
        )}
        {...checkboxProps}
      />
    </div>
  )
}

export function TodoLi(props: SlateRenderElementProps) {
  return (
    <li
      className={cn(
        'list-none',
        (props.element.checked as boolean) &&
          'text-muted-foreground line-through',
      )}
    >
      {props.children}
    </li>
  )
}

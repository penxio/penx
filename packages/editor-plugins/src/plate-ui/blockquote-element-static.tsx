import * as React from 'react'
import { SlateElement, type SlateElementProps } from '@udecode/plate'

export function BlockquoteElementStatic(props: SlateElementProps) {
  return (
    <SlateElement
      as="blockquote"
      className="my-1 border-l-2 pl-6 italic"
      {...props}
    />
  )
}

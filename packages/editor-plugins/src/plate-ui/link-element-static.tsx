import * as React from 'react'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import type { TLinkElement } from '@udecode/plate-link'

export function LinkElementStatic(props: SlateElementProps<TLinkElement>) {
  return (
    <SlateElement
      {...props}
      as="a"
      className="text-primary decoration-primary font-medium underline underline-offset-4"
    >
      {props.children}
    </SlateElement>
  )
}

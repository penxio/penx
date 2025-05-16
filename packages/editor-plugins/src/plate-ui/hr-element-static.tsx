import * as React from 'react'
import { cn } from '@penx/utils'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'

export function HrElementStatic(props: SlateElementProps) {
  return (
    <SlateElement {...props}>
      <div className="cursor-text py-6" contentEditable={false}>
        <hr
          className={cn(
            'bg-muted h-0.5 rounded-sm border-none bg-clip-content',
          )}
        />
      </div>
      {props.children}
    </SlateElement>
  )
}

'use client'

import * as React from 'react'
import { cn } from '@penx/utils'
import type { PlateElementProps } from '@udecode/plate/react'
import {
  PlateElement,
  useFocused,
  useReadOnly,
  useSelected,
} from '@udecode/plate/react'

export function HrElement(props: PlateElementProps) {
  const readOnly = useReadOnly()
  const selected = useSelected()
  const focused = useFocused()

  return (
    <PlateElement {...props}>
      <div className="py-6" contentEditable={false}>
        <hr
          className={cn(
            'bg-muted h-0.5 rounded-sm border-none bg-clip-content',
            selected && focused && 'ring-ring ring-2 ring-offset-2',
            !readOnly && 'cursor-pointer',
          )}
        />
      </div>
      {props.children}
    </PlateElement>
  )
}

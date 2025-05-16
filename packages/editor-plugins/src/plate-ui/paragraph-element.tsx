'use client'

import * as React from 'react'
import { cn } from '@penx/utils'
import type { PlateElementProps } from '@udecode/plate/react'
import { PlateElement } from '@udecode/plate/react'

export function ParagraphElement(props: PlateElementProps) {
  return (
    <PlateElement {...props} className={cn('m-0 px-0 py-1')}>
      {props.children}
    </PlateElement>
  )
}

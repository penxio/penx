'use client'

import * as React from 'react'
import type { PlateLeafProps } from '@udecode/plate/react'
import { PlateLeaf } from '@udecode/plate/react'

export function CodeLeaf(props: PlateLeafProps) {
  return (
    <PlateLeaf
      {...props}
      as="code"
      className="bg-muted whitespace-pre-wrap rounded-md px-[0.3em] py-[0.2em] font-mono text-sm"
    >
      {props.children}
    </PlateLeaf>
  )
}

'use client'

import React, { forwardRef, PropsWithChildren } from 'react'
import { Button } from '@penx/uikit/button'

interface Props {
  icon?: React.ReactElement
  isHighlight: boolean
}

export const ToolbarBtn = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<Props>
>(function ToolbarBtn({ children, icon, isHighlight, ...rest }, ref) {
  return (
    <Button
      ref={ref as any}
      size="sm"
      variant="secondary"
      className="flex items-center gap-1 rounded-md text-sm"
      {...rest}
    >
      <div className="inline-flex">{icon}</div>
      <div className="hidden sm:block">{children}</div>
    </Button>
  )
})

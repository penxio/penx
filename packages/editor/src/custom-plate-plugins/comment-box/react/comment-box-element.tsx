'use client'

import React, { useState } from 'react'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'

export const CommentBoxElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, nodeProps, ...rest } = props

  return (
    <PlateElement
      ref={ref}
      className={cn(className)}
      {...props}
      contentEditable={false}
    >
      <div className="border-foreground/5 text-foreground/60 bg-background flex h-20 items-center justify-center rounded-2xl border p-4">
        Comment box
      </div>
      {children}
    </PlateElement>
  )
})

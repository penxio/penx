'use client'

import React from 'react'
import { AIChatPlugin } from '@/components/custom-plate-plugins/plate-ai/react'
import { withRef } from '@udecode/cn'
import { useEditorPlugin } from '@udecode/plate/react'
import { ToolbarButton } from './toolbar'

export const AIToolbarButton = withRef<typeof ToolbarButton>(
  ({ children, ...rest }, ref) => {
    const { api } = useEditorPlugin(AIChatPlugin)

    return (
      <ToolbarButton
        ref={ref}
        {...rest}
        onClick={() => {
          api.aiChat.show()
        }}
        onMouseDown={(e) => {
          e.preventDefault()
        }}
      >
        {children}
      </ToolbarButton>
    )
  },
)

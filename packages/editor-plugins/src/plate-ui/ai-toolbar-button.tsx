'use client';

import React from 'react';
import { withRef } from '@udecode/cn';
import { useEditorPlugin } from '@udecode/plate/react'
import { AIChatPlugin } from '@penx/editor-custom-plugins/plate-ai/react/ai-chat/AIChatPlugin';
import { ToolbarButton } from './toolbar';


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
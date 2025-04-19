'use client'

import React from 'react'
import { CopilotPlugin } from '@penx/uikit/editor/custom-plate-plugins/plate-ai/react'
import { useElement, usePluginOption } from '@udecode/plate/react'

export const GhostText = () => {
  const element = useElement()

  const isSuggested = usePluginOption(
    CopilotPlugin,
    'isSuggested',
    element.id as string,
  )

  if (!isSuggested) return null

  return <GhostTextContent />
}

export function GhostTextContent() {
  const suggestionText = usePluginOption(CopilotPlugin, 'suggestionText')

  return (
    <span
      className="text-muted-foreground/70 pointer-events-none max-sm:hidden"
      contentEditable={false}
    >
      {suggestionText && suggestionText}
    </span>
  )
}

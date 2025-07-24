'use client'

import React from 'react'
import { usePanelCreationContext } from '@penx/components/PanelCreationProvider'
import { defaultEditorContent, isMobileApp } from '@penx/constants'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { ICreationNode } from '@penx/model-type'
import { NovelEditor } from '@penx/novel-editor/components/novel-editor'
import { FixedToolbar } from './FixedToolbar'
import { KeyboardPadding } from './KeyboardPadding'

interface Props {
  value: any
  onChange: (value: any) => void
}

export function MobileCreationEditor({ value, onChange }: Props) {
  return (
    <NovelEditor
      className=""
      value={value}
      onChange={(v: any) => {
        onChange(v)
      }}
    >
      <FixedToolbar />
      <KeyboardPadding></KeyboardPadding>
    </NovelEditor>
  )
}

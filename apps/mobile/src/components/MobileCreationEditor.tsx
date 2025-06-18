'use client'

import React from 'react'
import { usePanelCreationContext } from '@penx/components/PanelCreationProvider'
import { defaultEditorContent, isMobileApp } from '@penx/constants'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { ICreationNode } from '@penx/model-type'
import { NovelEditor } from '@penx/novel-editor/components/novel-editor'
import { FixedToolbar } from './FixedToolbar'
import { KeyboardPadding } from './KeyboardPadding'

interface Props {}

export function MobileCreationEditor({}: Props) {
  const creation = usePanelCreationContext()

  return (
    <NovelEditor
      className=""
      value={
        creation.content ? JSON.parse(creation.content) : defaultEditorContent
      }
      onChange={(v: any[]) => {
        const input = {
          content: JSON.stringify(v),
        } as ICreationNode['props']

        // if (creation.type === StructType.NOTE) {
        //   const title = v
        //     .map((n) => Node.string(n))
        //     .join(', ')
        //     .slice(0, 20)
        //   input.title = title
        // }

        updateCreationProps(creation.id, input)
      }}
    >
      <FixedToolbar />
      <KeyboardPadding></KeyboardPadding>
    </NovelEditor>
  )
}

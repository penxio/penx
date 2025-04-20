'use client'

import React, { useEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import isEqual from 'react-fast-compare'
import { Plate } from '@udecode/plate/react'
import { VariantProps } from 'class-variance-authority'
import { Transforms } from 'slate'
// import { SettingsDialog } from '@penx/uikit/editor/settings'
import {
  PlateEditorType,
  useCreateEditor,
} from '@penx/editor/use-create-editor'
import {
  Editor,
  EditorContainer,
  editorVariants,
} from '@penx/uikit/plate-ui/editor'
import { cn } from '@penx/utils'

import { AddNodeBtn } from '@penx/uikit/components/AddNodeBtn'

// import { AddNodeBtn } from '../AddNodeBtn'

interface Props {
  readonly?: boolean
  value: any
  className?: string
  showAddButton?: boolean
  showFixedToolbar?: boolean
  draggable?: boolean
  dndProvider?: boolean
  placeholder?: string
  children?: React.ReactNode
  onInit?: (editor: PlateEditorType) => void
  onChange?: (value: any) => void
  editorProps?: any
}

export function PlateEditor({
  onChange,
  value,
  className,
  showAddButton = false,
  showFixedToolbar = false,
  readonly = false,
  draggable = true,
  dndProvider = true,
  placeholder,
  onInit,
  variant = 'none',
  children,
  editorProps = {},
}: Props & VariantProps<typeof editorVariants>) {
  const valueRef = useRef(value)
  const editor = useCreateEditor({
    value: valueRef.current,
    placeholder,
    showFixedToolbar,
  })

  useEffect(() => {
    onInit?.(editor)
  }, [])

  useEffect(() => {
    if (isEqual(value, valueRef.current)) return
    // editor.tf.reset()
    // editor.tf.setValue(value)
    // valueRef.current = value
  }, [value])

  const innerJSX = (
    <Plate
      editor={editor}
      onValueChange={({ value }) => {
        onChange?.(value)
      }}
    >
      <EditorContainer>
        <Editor
          variant={variant}
          readOnly={readonly}
          className={cn('text-base', className, showFixedToolbar && 'pt-3')}
          {...editorProps}
        />
        {showAddButton && (
          <div className="size-full px-16 pt-4 text-base sm:px-[max(10px,calc(50%-350px))]">
            <AddNodeBtn editor={editor} />
          </div>
        )}
        {children}
      </EditorContainer>

      {/* <SettingsDialog /> */}
    </Plate>
  )

  if (dndProvider) {
    return <DndProvider backend={HTML5Backend}>{innerJSX}</DndProvider>
  }
  return innerJSX
}

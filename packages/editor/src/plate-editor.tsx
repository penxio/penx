'use client'

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import isEqual from 'react-fast-compare'
import { Plate } from '@udecode/plate/react'
import {
  Editor,
  EditorContainer,
  EditorVariantProps,
} from '@penx/editor-plugins/plate-ui/editor'
import {
  PlateEditorType,
  useCreateEditor,
} from '@penx/editor/use-create-editor'
import { appEmitter } from '@penx/emitter'
import { Panel } from '@penx/types'
import { AddNodeBtn } from '@penx/uikit/AddNodeBtn'
import { cn } from '@penx/utils'
import { focusFirstEmptyParagraphOrEnd } from './lib/focusFirstEmptyParagraphOrEnd'

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
  ref?: any
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
  ref,
}: Props & EditorVariantProps) {
  const valueRef = useRef(value)
  const editor = useCreateEditor({
    value: valueRef.current,
    placeholder,
    showFixedToolbar,
  })

  useImperativeHandle(ref, () => editor)

  useEffect(() => {
    onInit?.(editor)
  }, [])

  useEffect(() => {
    if (isEqual(value, valueRef.current)) return
    // editor.tf.reset()
    // editor.tf.setValue(value)
    // valueRef.current = value
  }, [value])

  useEffect(() => {
    const handleFocus = () => {
      focusFirstEmptyParagraphOrEnd(editor as any)
    }
    appEmitter.on('FOCUS_EDITOR', handleFocus)
    return () => {
      appEmitter.off('FOCUS_EDITOR', handleFocus)
    }
  }, [])

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
          <div
            className={cn(
              'size-full px-0 pt-4 text-base sm:px-[max(10px,calc(50%-350px))]',
            )}
          >
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

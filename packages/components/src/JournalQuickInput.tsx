'use client'

import type React from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { t } from '@lingui/core/macro'
import { Editor } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { format } from 'date-fns'
import { SendHorizonalIcon, SquareCheckIcon } from 'lucide-react'
import { defaultEditorContent, isMobileApp } from '@penx/constants'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { cn } from '@penx/utils'
import { docToString, stringToDoc } from '@penx/utils/editorHelper'
import { JournalInputToolbar } from './JournalInputToolbar'
import { StructTypeSelect } from './StructTypeSelect'

interface Props {
  className?: string
  ref?: any
  isTask?: boolean
  placeholder?: string
  date?: string
  cells?: any
  onCancel?: () => void
  afterSubmit?: () => void
}

export function JournalQuickInput({
  className,
  afterSubmit,
  onCancel,
  ref,
  placeholder,
  date,
  cells,
  ...props
}: Props) {
  const editorRef = useRef<Editor>(null)
  const [input, setInput] = useState('')
  // const { structs } = useStructs()
  // const noteStruct = structs.find((s) => s.type === StructType.NOTE)!
  // const [struct, setStruct] = useState(noteStruct)
  const addCreation = useAddCreation()
  const [isTask, setIsTask] = useState(props.isTask)

  useEffect(() => {
    if (isTask !== props.isTask) setIsTask(props.isTask)
  }, [props.isTask])

  useImperativeHandle(ref, () => editorRef.current)

  const editor = useEditor(
    {
      content: defaultEditorContent,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: ({ node }) => {
            return placeholder || 'Writing something..'
          },
        }),
      ],
      immediatelyRender: false,
      onUpdate({ editor }) {
        setInput(JSON.stringify(editor.getJSON()))
      },
    },
    [],
  )

  const submitForm = async () => {
    // const isNote = struct.type === StructType.NOTE
    const isNote = !isTask
    const title = isNote ? '' : docToString(JSON.parse(input))
    const content = isNote ? input : JSON.stringify(defaultEditorContent)

    addCreation({
      // type: struct.type,
      type: isTask ? StructType.TASK : StructType.NOTE,
      title: title,
      content: content,
      isAddPanel: false,
      date: date ? date : format(new Date(), 'yyyy-MM-dd'),
      cells: cells,
    })
    editor?.commands.clearContent()
    afterSubmit?.()
    setInput('')
  }

  useEffect(() => {
    if (editor) {
      editor.chain().focus().run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div
      id="journal-quick-input"
      className={cn(
        'bg-background text-foreground shadow-popover penx-editor relative flex max-h-[calc(75dvh)] min-h-[36px] w-full flex-col rounded-xl border-0 pb-12 !text-base ring-0 focus-visible:ring-0 dark:bg-neutral-800',
        className,
      )}
      onClick={(e: any) => {
        if (e.target.id === 'journal-quick-input') {
          editor.chain().focus().run()
        }
      }}
    >
      <div className="">
        <EditorContent
          className="focus-visible::outline-0 prose px-3 pb-10 pt-2 focus-visible:border-0"
          editor={editor}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              (event.ctrlKey || event.metaKey) &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault()
              submitForm()
            }
          }}
        />
      </div>

      <div className="text-foreground/60 absolute bottom-2 flex w-fit flex-row items-center justify-start gap-0.5 py-0 pl-2">
        {/* <StructTypeSelect
          value={struct}
          setFocused={() => {
            editor.chain().focus().run()
          }}
          onChange={(s) => {
            setStruct(s)
            editor.chain().focus().run()
          }}
        /> */}

        <Checkbox
          className="border-foreground/40 size-5"
          checked={isTask}
          onCheckedChange={(v: boolean) => {
            editor.chain().focus().run()
            console.log('=====v:', v)
            setIsTask(v)
          }}
        />
        {/* <JournalInputToolbar editor={editor} /> */}
      </div>

      <div
        className={cn(
          'absolute bottom-0 right-0 flex w-fit flex-row justify-end gap-1 p-2',
        )}
      >
        <SendButton input={input} submitForm={submitForm} />
      </div>
    </div>
  )
}

function SendButton({
  submitForm,
  input,
}: {
  submitForm: () => void
  input: string
}) {
  return (
    <Button
      size="sm"
      className={cn('h-7', isMobileApp && 'h-8 px-3')}
      onClick={(event) => {
        event.preventDefault()
        submitForm()
      }}
    >
      <SendHorizonalIcon size={16} />
    </Button>
  )
}

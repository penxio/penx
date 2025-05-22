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
import cx from 'classnames'
import { SendHorizonalIcon } from 'lucide-react'
import { toast } from 'sonner'
import { editorDefaultValue, isMobileApp } from '@penx/constants'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Textarea } from '@penx/uikit/textarea'
import { cn } from '@penx/utils'
import { StructTypeSelect } from './StructTypeSelect'

export function JournalQuickInput({
  afterSubmit,
  onCancel,
  ref,
}: {
  ref?: any
  onCancel?: () => void
  afterSubmit?: () => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState('')
  const { structs } = useStructs()
  const noteStruct = structs.find((s) => s.type === StructType.NOTE)!
  const [struct, setStruct] = useState(noteStruct)
  const addCreation = useAddCreation()

  useImperativeHandle(ref, () => textareaRef.current)

  useEffect(() => {
    if (textareaRef.current) {
      // adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const submitForm = useCallback(() => {
    const content = input.split('\n')
    const slateValue = content.map((line) => ({
      type: 'p',
      children: [{ text: line }],
    }))
    const title = content.join('. ')
    addCreation({
      type: struct.type,
      title: title,
      content:
        struct.type === StructType.NOTE
          ? JSON.stringify(slateValue)
          : JSON.stringify(editorDefaultValue),
      isAddPanel: false,
    })
    afterSubmit?.()
    setInput('')
  }, [input])

  return (
    <div
      className={cn(
        'relative flex w-full flex-col',
        // isColorful && 'bg-linear-to-r  from-indigo-500 via-purple-500 to-pink-500 p-0.5',
      )}
    >
      <Textarea
        ref={textareaRef}
        placeholder="What's on your mind?"
        value={input}
        onChange={handleInput}
        enterKeyHint="done"
        autoFocus
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
        className={cx(
          'bg-background text-foreground shadow-popover max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-xl border-0 pb-12 !text-base ring-0 focus-visible:ring-0',
        )}
        // rows={2}
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()
            submitForm()
          }
        }}
      />
      <div className="text-foreground/60 absolute bottom-2 flex w-fit flex-row items-center justify-start gap-0.5 py-0 pl-2">
        <StructTypeSelect
          value={struct}
          onOpenChange={() => {
            textareaRef.current?.focus()
          }}
          onChange={(s) => {
            setStruct(s)
            textareaRef.current?.focus()
          }}
        />
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

function PureSendButton({
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

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false
  return true
})

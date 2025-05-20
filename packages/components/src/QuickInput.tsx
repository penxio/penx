'use client'

import type React from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { Attachment, UIMessage } from 'ai'
import cx from 'classnames'
import equal from 'fast-deep-equal'
import { CogIcon, ExpandIcon, SendHorizonalIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { store } from '@penx/store'
import { PanelType, StructType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Checkbox } from '@penx/uikit/checkbox'
import { Textarea } from '@penx/uikit/textarea'
import { cn } from '@penx/utils'

export function QuickInput({
  afterSubmit,
  onCancel,
  ref,
  isColorful = true,
}: {
  ref?: any
  onCancel?: () => void
  afterSubmit?: () => void
  isColorful?: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState('')
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
    console.log('====event.target.value:', event.target.value)

    setInput(event.target.value)
    adjustHeight()
  }

  const submitForm = useCallback(() => {
    const content = input.split('\n')
    const slateValue = content.map((line) => ({
      type: 'p',
      children: [{ text: line }],
    }))
    addCreation({
      type: StructType.NOTE,
      content: JSON.stringify(slateValue),
      isAddPanel: false,
    })
    afterSubmit?.()
    setInput('')
  }, [input])

  return (
    <div
      className={cn(
        'bg-linear-to-r relative flex w-full flex-col gap-4 rounded-xl shadow-2xl',
        focused && 'shadow-2xl',
        isColorful && 'from-indigo-500 via-purple-500 to-pink-500 p-0.5',
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
          'bg-background text-foreground max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-xl pb-8 !text-base shadow-md focus-visible:ring-0',
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
        <Checkbox />
        {/* <Button
          size="icon"
          variant="ghost"
          className="hover:bg-foreground/10 size-7 rounded-md"
          type="button"
          onClick={() => {
            store.panels.addPanel({
              type: PanelType.AI_PROVIDERS,
            })
          }}
        >
          <ExpandIcon size={15} />
        </Button> */}
      </div>
      <div className="absolute bottom-0 right-0 flex w-fit flex-row justify-end gap-1 p-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-7"
          onClick={(event) => {
            setInput('')
            resetHeight()
            onCancel && onCancel()
          }}
        >
          <XIcon size={16} />
        </Button>

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
      className="h-7"
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

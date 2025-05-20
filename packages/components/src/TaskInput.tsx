'use client'

import type React from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import equal from 'fast-deep-equal'
import { CogIcon, ExpandIcon, SendHorizonalIcon, XIcon } from 'lucide-react'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Textarea } from '@penx/uikit/textarea'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  onSubmit?: () => void
}

export function TaskInput({ className, onSubmit }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState('')
  const addCreation = useAddCreation()

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
    const title = input.split('\n').join(',')
    addCreation({
      type: StructType.TASK,
      title,
      isAddPanel: false,
    })
    onSubmit?.()
    setInput('')
  }, [input])

  return (
    <div
      className={cn(
        'bg-linear-to-r relative flex w-full flex-col gap-4 rounded-xl from-indigo-500 via-purple-500 to-pink-500 p-0.5',
        focused && 'shadow-2xl',
        className,
      )}
    >
      <Textarea
        ref={textareaRef}
        placeholder="What's on your mind?"
        value={input}
        onChange={handleInput}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
        }}
        className={cx(
          'bg-background max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-xl pb-8 !text-base shadow-md focus-visible:ring-0',
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
      <div className="text-foreground/60 absolute bottom-2 flex w-fit flex-row items-center justify-start gap-0.5 py-0 pl-2"></div>
      <div className="absolute bottom-0 right-0 flex w-fit flex-row justify-end gap-1 p-2">
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

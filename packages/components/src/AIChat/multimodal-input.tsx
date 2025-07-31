'use client'

import type React from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { text } from 'stream/consumers'
import type { UseChatHelpers } from '@ai-sdk/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import type { Attachment, UIMessage } from 'ai'
import cx from 'classnames'
import equal from 'fast-deep-equal'
import { AtSign, CogIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { isDesktop } from '@penx/constants'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Textarea } from '@penx/uikit/textarea'
import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons'
import { PreviewAttachment } from './preview-attachment'

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string
  input: UseChatHelpers['input']
  setInput: UseChatHelpers['setInput']
  status: UseChatHelpers['status']
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<UIMessage>
  setMessages: UseChatHelpers['setMessages']
  append: UseChatHelpers['append']
  handleSubmit: UseChatHelpers['handleSubmit']
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
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
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage('input', '')

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
      adjustHeight()
    }
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if ((event.nativeEvent as InputEvent).data === '@') {
    }

    setInput(event.target.value)
    adjustHeight()
  }

  const submit = useCallback(() => {
    handleSubmit(undefined, {
      body: { text: input },
      experimental_attachments: attachments,
    })

    setAttachments([])
    setLocalStorageInput('')
    resetHeight()

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
  ])

  return (
    <div className="relative flex h-full w-full gap-4">
      <div
        className={cx(
          'shadow- flex w-full flex-col gap-2 rounded-3xl border bg-white p-4  dark:border-zinc-700 dark:bg-zinc-900',
        )}
      >
        <textarea
          ref={textareaRef}
          data-testid="multimodal-input"
          placeholder={t`Send a message...`}
          value={input}
          autoFocus
          onChange={handleInput}
          className={cx(
            'max-h-[calc(25dvh)] w-full resize-none overflow-y-auto border-none bg-transparent text-sm outline-none',
          )}
          rows={1}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault()

              if (status !== 'ready') {
                toast.error(
                  t`Please wait for the model to finish its response!`,
                )
              } else {
                submit()
              }
            }
          }}
        />
        <div className="flex w-full items-center justify-end gap-3">
          {status === 'submitted' ? (
            <StopButton stop={stop} setMessages={setMessages} />
          ) : (
            <SendButton input={input} submitForm={submit} uploadQueue={[]} />
          )}
        </div>
      </div>
    </div>
  )
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false
    if (prevProps.status !== nextProps.status) return false
    if (!equal(prevProps.attachments, nextProps.attachments)) return false

    return true
  },
)

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void
  setMessages: UseChatHelpers['setMessages']
}) {
  return (
    <Button
      data-testid="stop-button"
      className="h-fit cursor-pointer rounded-full border p-1.5"
      onClick={(event) => {
        event.preventDefault()
        stop()
        setMessages((messages) => messages)
      }}
    >
      <StopIcon size={14} />
    </Button>
  )
}

const StopButton = memo(PureStopButton)

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void
  input: string
  uploadQueue: Array<string>
}) {
  return (
    <Button
      data-testid="send-button"
      className="disabled:bg-primary/30 h-fit rounded-full p-1.5"
      onClick={(event) => {
        event.preventDefault()
        submitForm()
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false
  if (prevProps.input !== nextProps.input) return false
  return true
})

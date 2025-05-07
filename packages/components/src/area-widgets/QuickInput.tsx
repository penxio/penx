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
import type { UseChatHelpers } from '@ai-sdk/react'
import type { Attachment, UIMessage } from 'ai'
import cx from 'classnames'
import equal from 'fast-deep-equal'
import { CogIcon, ExpandIcon, SendHorizonalIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Checkbox } from '@penx/uikit/checkbox'
import { Textarea } from '@penx/uikit/textarea'
import { cn } from '@penx/utils'
import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons'

export function QuickInput({}: {}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState('')

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

  const [localStorageInput, setLocalStorageInput] = useLocalStorage('input', '')

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
      // adjustHeight()
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

  const submitForm = useCallback(() => {
    //
  }, [])

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const { url, pathname, contentType } = data

        return {
          url,
          name: pathname,
          contentType: contentType,
        }
      }
      const { error } = await response.json()
      toast.error(error)
    } catch (error) {
      toast.error('Failed to upload file, please try again!')
    }
  }

  return (
    <div
      className={cn(
        'bg-linear-to-r relative flex w-full flex-col gap-4 rounded-xl from-indigo-500 via-purple-500 to-pink-500 p-0.5',
        focused && 'shadow-2xl',
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
        autoFocus
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()

            if (status !== 'ready') {
              toast.error('Please wait for the model to finish its response!')
            } else {
              submitForm()
            }
          }
        }}
      />
      <div className="text-foreground/60 absolute bottom-0.5 flex w-fit flex-row items-center justify-start gap-0.5 py-0 pl-2">
        <Checkbox />
        <Button
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
        </Button>
      </div>
      <div className="absolute bottom-0 right-0 flex w-fit flex-row justify-end p-2">
        <div>
          <SendButton input={input} submitForm={submitForm} />
        </div>
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

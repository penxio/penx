'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { Attachment, UIMessage } from 'ai'
import { rest } from 'lodash'
import { useLocalStorage } from 'usehooks-ts'
import {
  AI_SERVICE_HOST,
  APP_LOCAL_HOST,
  isDesktop,
  ROOT_HOST,
} from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useArtifactSelector } from '@penx/hooks/use-artifact'
import { idb } from '@penx/indexeddb'
import { AIModel } from '@penx/model-type'
import { LLMProviderType, PanelType, SessionData } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { uniqueId } from '@penx/unique-id'
import { Messages } from './messages'
import { MultimodalInput } from './multimodal-input'
import { toast } from './toast'

interface ApplicationError extends Error {
  info: string
  status: number
}

interface Selection {
  text?: string
  process?: ProcessInfo
}

interface ProcessInfo {
  pid?: number
  name?: string
  bundleIdentifier?: string
}

interface Props {
  id: string
  initialMessages: Array<UIMessage>
  isReadonly: boolean
  session: SessionData
  isAICommand?: boolean
  selection?: Selection
  systemPrompt?: string
  provider?: {
    type: any
    model: AIModel
    apiKey?: string
  }
}

export function Chat({
  id,
  initialMessages,
  isAICommand,
  systemPrompt,
  selection,
  isReadonly,
  session,
  provider,
}: Props) {
  // const host = provider?.type === 'PENX' ? AI_SERVICE_HOST : APP_LOCAL_HOST
  const host = APP_LOCAL_HOST
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    ...rest
  } = useChat({
    api: host + '/api/ai/chat',
    // api: 'http://localhost:4000' + '/api/ai/chat',
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    generateId: uniqueId,
    experimental_prepareRequestBody: (body) => {
      console.log('body............>>>>>')

      return {
        ...body,
        ...provider,
        messages: [
          {
            id: uniqueId(),
            content: systemPrompt,
            role: 'system',
          },
          body.messages[body.messages.length - 1],
        ],
        model: provider?.model.id,
      }
    },
    onFinish: async (message, options) => {
      await idb.message.add({
        id: uniqueId(),
        chatId: id,
        role: 'user',
        parts: [{ type: 'text', text: input }],
        spaceId: session.spaceId,
        createdAt: new Date(),
      })

      await idb.message.add({
        id: uniqueId(),
        chatId: id,
        role: message.role,
        parts: message.parts,
        spaceId: session.spaceId,
        createdAt: new Date(),
      })
    },
    onError: async (error) => {
      console.log('=====error:', error)

      toast({
        type: 'error',
        description: error.message,
      })
    },
  })

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible)
  const [localStorageInput, setLocalStorageInput] = useLocalStorage('input', '')

  const submitted = useRef(false)
  useEffect(() => {
    setTimeout(() => {
      handleSubmit()
    }, 0)
  }, [])

  // useEffect(() => {
  //   if (!selection) return
  //   if (submitted.current) return
  //   submitted.current = true

  //   console.log('=======selection.text!:', selection.text!)

  //   setInput(selection.text!)
  // }, [selection])

  // useEffect(() => {
  //   console.log('input === selection?.text:', input === selection?.text, input)

  //   // if (!submitted.current) return
  //   if (input === selection?.text) {
  //     handleSubmit(undefined)
  //   }
  // }, [input])

  useEffect(() => {
    if (!selection) return

    setInput(selection.text!)
    // if (submitted.current) return
    // submitted.current = true
    // const run = async () => {
    //   setInput(selection.text!)
    //   await new Promise((r) => setTimeout(r, 0))
    //   handleSubmit()
    // }
    // run()

    setTimeout(() => {
      appEmitter.emit('SUBMIT_AI_CHAT', selection.text!)
    }, 100)

    // append({
    //   id: uniqueId(),
    //   role: 'user',
    //   content: selection.text!,
    // }).then(() => {
    //   submitted.current = false
    // })
  }, [selection])

  return (
    <>
      <div className="flex h-full w-full min-w-0 flex-col">
        <div className="min-h-0 w-full flex-1">
          <Messages
            chatId={id}
            status={status}
            messages={messages}
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
            isArtifactVisible={isArtifactVisible}
          />
        </div>

        <form className="mx-auto flex w-full gap-2 px-2 pb-2 md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              isAICommand={isAICommand}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>
    </>
  )
}

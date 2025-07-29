'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import type { Attachment, UIMessage } from 'ai'
import { useSearchParams } from 'next/navigation'
import useSWR, { useSWRConfig } from 'swr'
import { unstable_serialize } from 'swr/infinite'
import { isDesktop, ROOT_HOST } from '@penx/constants'
import { useArtifactSelector } from '@penx/hooks/use-artifact'
import { queryMessages, refetchMessages } from '@penx/hooks/useMessages'
import { useMySpace } from '@penx/hooks/useMySpace'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { PanelType, SessionData } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { Artifact } from './artifact'
import { Messages } from './messages'
import { MultimodalInput } from './multimodal-input'
import { toast } from './toast'

interface ApplicationError extends Error {
  info: string
  status: number
}

export function Chat({
  id,
  initialMessages,
  isReadonly,
  session,
}: {
  id: string
  initialMessages: Array<UIMessage>
  isReadonly: boolean
  session: SessionData
}) {
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
  } = useChat({
    api: ROOT_HOST + '/api/ai/chat',
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: uniqueId,
    experimental_prepareRequestBody: (body) => {},
    onFinish: async (message, options) => {
      await localDB.message.add({
        id: uniqueId(),
        chatId: id,
        role: 'user',
        parts: [{ type: 'text', text: input }],
        spaceId: session.spaceId,
        createdAt: new Date(),
      })

      await localDB.message.add({
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

        <form className="mx-auto flex w-full gap-2 p-2 md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
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

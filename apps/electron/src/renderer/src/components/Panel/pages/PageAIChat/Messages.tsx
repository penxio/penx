import { memo } from 'react'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import equal from 'fast-deep-equal'
import { Greeting } from './Greeting'
import { ChatMessage } from './hooks/useMessages'
import { useScrollToBottom } from './hooks/useScrollToBottom'
import { PreviewMessage, ThinkingMessage } from './Message'

interface MessagesProps {
  chatId: string
  status: UseChatHelpers['status']
  messages: ChatMessage[]
  isReadonly: boolean
}

function PureMessages({ chatId, status, messages, isReadonly }: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>()

  return (
    <div
      ref={messagesContainerRef}
      className="flex h-full min-w-0 flex-col gap-6 overflow-y-auto pt-4"
    >
      {messages.length === 0 && <Greeting />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === 'streaming' && messages.length - 1 === index}
          isReadonly={isReadonly}
        />
      ))}

      {status === 'submitted' &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="min-h-[24px] min-w-[24px] shrink-0"
      />
    </div>
  )
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false
  if (prevProps.status && nextProps.status) return false
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (!equal(prevProps.messages, nextProps.messages)) return false

  return true
})

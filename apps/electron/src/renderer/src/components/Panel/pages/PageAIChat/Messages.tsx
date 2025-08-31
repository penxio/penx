import { memo, useMemo } from 'react'
import equal from 'fast-deep-equal'
import { Greeting } from './Greeting'
import { ChatMessage } from './hooks/useMessages'
import { useScrollToBottom } from './hooks/useScrollToBottom'
import { PreviewMessage } from './Message'

interface MessagesProps {
  chatId: string
  messages: ChatMessage[]
  isReadonly: boolean
  loading: boolean
}

function PureMessages({
  chatId,
  messages,
  loading,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>()

  return (
    <div
      ref={messagesContainerRef}
      className="flex h-full min-w-0 flex-col gap-6 overflow-y-auto pt-4"
    >
      {messages.length === 0 && <Greeting />}

      {messages.map((message, index) => {
        return (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            loading={loading && messages.length - 1 === index}
            isReadonly={isReadonly}
          />
        )
      })}

      <div
        ref={messagesEndRef}
        className="min-h-[24px] min-w-[24px] shrink-0"
      />
    </div>
  )
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (!equal(prevProps.messages, nextProps.messages)) return false

  return true
})

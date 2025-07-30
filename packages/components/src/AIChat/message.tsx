'use client'

import { memo, useState } from 'react'
import { UseChatHelpers } from '@ai-sdk/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import type { UIMessage } from 'ai'
import cx from 'classnames'
import equal from 'fast-deep-equal'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@penx/utils'
import { SparklesIcon } from './icons'
import { Markdown } from './markdown'
import { MessageActions } from './message-actions'
import { MessageEditor } from './message-editor'
import { MessageReasoning } from './message-reasoning'
import { PreviewAttachment } from './preview-attachment'

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string
  message: UIMessage
  isLoading: boolean
  setMessages: UseChatHelpers['setMessages']
  reload: UseChatHelpers['reload']
  isReadonly: boolean
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="group/message mx-auto w-full max-w-3xl px-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="ring-border bg-background flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex w-full flex-col gap-4">
            {message.experimental_attachments && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part
              const key = `message-${message.id}-part-${index}`

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                )
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row items-start gap-2">
                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground rounded-xl px-3 py-2':
                            message.role === 'user',
                        })}
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    </div>
                  )
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row items-start gap-2">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  )
                }
              }

              // Show tool-invocation as thinking process UI
              if (type === 'tool-invocation') {
                const { toolInvocation } = part
                const { toolName, toolCallId, state } = toolInvocation

                if (state === 'call') {
                  const { args } = toolInvocation

                  return (
                    <div
                      key={toolCallId}
                      className="bg-muted/50 text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                    >
                      <div className="size-4 animate-spin">
                        <SparklesIcon size={14} />
                      </div>
                      <span>
                        {toolName === 'vectorQuery' ? (
                          <Trans>Searching knowledge base...</Trans>
                        ) : (
                          <Trans>Using {toolName}...</Trans>
                        )}
                      </span>
                    </div>
                  )
                }

                if (state === 'result') {
                  // Show completion indicator for tool results
                  return (
                    <div
                      key={toolCallId}
                      className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    >
                      <div className="size-4">
                        <SparklesIcon size={14} />
                      </div>
                      <span>
                        {toolName === 'vectorQuery' ? (
                          <Trans>Knowledge search completed</Trans>
                        ) : (
                          <Trans>{toolName} completed</Trans>
                        )}
                      </span>
                    </div>
                  )
                }
              }

              // Keep other part types as before if any exist
              return null
            })}
            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (prevProps.message.id !== nextProps.message.id) return false
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false

    return true
  },
)

export const ThinkingMessage = () => {
  const role = 'assistant'

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="group/message mx-auto w-full max-w-3xl px-4 "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="text-muted-foreground flex flex-col gap-4">
            <Trans>Hmm...</Trans>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

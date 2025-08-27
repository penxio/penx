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
import { ChatMessage } from './hooks/useMessages'
import { SparklesIcon } from './icons'
import { Markdown } from './Markdown'

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  isReadonly,
}: {
  chatId: string
  message: ChatMessage
  isLoading: boolean
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
            <div className="flex flex-row items-start gap-2">
              <div
                data-testid="message-content"
                className={cn('flex flex-col gap-4', {
                  'bg-primary text-primary-foreground rounded-xl px-3 py-2':
                    message.role === 'user',
                })}
              >
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
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
    if (!equal(prevProps.message.content, nextProps.message.content))
      return false

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

import { useRef, useState } from 'react'
import { t } from '@lingui/core/macro'
import { toast } from 'sonner'
import { appEmitter } from '@penx/emitter'
import { cn } from '@penx/utils'
import { useInput } from './hooks/useInput'
import { SendButton } from './SendButton'
import { StopButton } from './StopButton'

export function SendBox() {
  const [status, setStatus] = useState('')
  const { input, setInput } = useInput()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  return (
    <div className="relative flex h-full w-full gap-4">
      <div
        className={cn(
          'shadow-popover bg-background flex w-full flex-col gap-2 rounded-xl p-3 dark:bg-neutral-800',
        )}
      >
        <textarea
          ref={textareaRef}
          data-testid="multimodal-input"
          // placeholder={t`Send a message...`}
          placeholder={t`Chat with my data...`}
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          className={cn(
            'max-h-[calc(25dvh)] w-full resize-none overflow-y-auto border-none bg-transparent text-sm outline-none',
          )}
          rows={2}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') {
              event.stopPropagation()
            }
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault()
              appEmitter.emit('SUBMIT_AI_CHAT', input)
            }
          }}
        />
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            {/* {!isAICommand && (
              <ChatTypeSelect value={chatType} onSelect={setChatType} />
            )} */}
          </div>
          {status === 'submitted' ? <StopButton /> : <SendButton />}
        </div>
      </div>
    </div>
  )
}

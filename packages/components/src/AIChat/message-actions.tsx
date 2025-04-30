import { memo } from 'react'
import type { Message } from 'ai'
import equal from 'fast-deep-equal'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { useCopyToClipboard } from 'usehooks-ts'
import { Button } from '@penx/uikit/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'
import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from './icons'

export function PureMessageActions({
  chatId,
  message,
  isLoading,
}: {
  chatId: string
  message: Message
  isLoading: boolean
}) {
  const { mutate } = useSWRConfig()
  const [_, copyToClipboard] = useCopyToClipboard()

  if (isLoading) return null
  if (message.role === 'user') return null

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground h-fit px-2 py-1"
              variant="outline"
              onClick={async () => {
                const textFromParts = message.parts
                  ?.filter((part) => part.type === 'text')
                  .map((part) => part.text)
                  .join('\n')
                  .trim()

                if (!textFromParts) {
                  toast.error("There's no text to copy!")
                  return
                }

                await copyToClipboard(textFromParts)
                toast.success('Copied to clipboard!')
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false

    return true
  },
)

'use client'

import { useMessages } from '@penx/hooks/useMessages'
import { useSession } from '@penx/session'
import { Panel } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { Chat } from '../../AIChat/chat'

interface Props {
  panel: Panel
  index: number
}

export function PanelChat({ panel, index }: Props) {
  const { session } = useSession()
  const { isLoading, data = [] } = useMessages()

  if (isLoading) return null

  return (
    <Chat
      id={uniqueId()}
      // panel={panel}
      // index={index}
      initialMessages={data}
      session={session}
      selectedChatModel={''}
      selectedVisibilityType="private"
      isReadonly={false}
    />
  )
}

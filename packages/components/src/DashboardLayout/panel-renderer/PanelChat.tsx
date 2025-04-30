'use client'

import { useQuery } from '@tanstack/react-query'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { Panel, PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { Chat } from '../../AIChat/chat'

interface Props {
  panel: Panel
  index: number
}

export function PanelChat({ panel, index }: Props) {
  const { session } = useSession()
  const { isLoading, data = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const list = await localDB.message
        .where({ siteId: session.siteId })
        .toArray()

      return list.toSorted((a, b) => {
        return a.createdAt.valueOf() - b.createdAt.valueOf()
      })
    },
  })

  if (isLoading) return null
  const messages = data.map((m) => ({ ...m, content: m.parts[0].text }))
  return (
    <Chat
      id={uniqueId()}
      // panel={panel}
      // index={index}
      initialMessages={messages}
      session={session}
      selectedChatModel={''}
      selectedVisibilityType="private"
      isReadonly={false}
    />
  )
}

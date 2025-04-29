'use client'

import { useMemo } from 'react'
import useSWR, { useSWRConfig } from 'swr'

type ChatHistory = any
type VisibilityType = any

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string
  initialVisibility: VisibilityType
}) {
  const { mutate, cache } = useSWRConfig()
  const history: ChatHistory = cache.get('/api/history')?.data

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibility,
    },
  )

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility
    const chat = history.chats.find((chat: any) => chat.id === chatId)
    if (!chat) return 'private'
    return chat.visibility
  }, [history, chatId, localVisibility])

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType)
    // mutate(unstable_serialize(getChatHistoryPaginationKey));

    // updateChatVisibility({
    //   chatId: chatId,
    //   visibility: updatedVisibilityType,
    // });
  }

  return { visibilityType, setVisibilityType }
}

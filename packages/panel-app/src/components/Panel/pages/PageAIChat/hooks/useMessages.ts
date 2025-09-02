import { atom, useAtom } from 'jotai'
import { store } from '@penx/store'

export type ChatMessage = {
  id: string
  createdAt?: Date
  content: string
  role: 'system' | 'user' | 'assistant' | 'data'
  isLoading?: boolean
}

export const messagesAtom = atom<ChatMessage[]>([])

export function useMessages() {
  const [messages, setMessages] = useAtom(messagesAtom)
  return { messages, setMessages }
}

export function getMessages() {
  return store.get(messagesAtom)
}

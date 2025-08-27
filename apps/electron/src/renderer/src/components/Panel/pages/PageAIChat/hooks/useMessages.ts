import { atom, useAtom } from 'jotai'

export type ChatMessage = {
  id: string
  createdAt?: Date
  content: string
  role: 'system' | 'user' | 'assistant' | 'data'
}

export const messagesAtom = atom<ChatMessage[]>([])

export function useMessages() {
  const [messages, setMessages] = useAtom(messagesAtom)
  return { messages, setMessages }
}

export interface IMessage {
  id: string
  chatId: string
  role: 'system' | 'user' | 'assistant' | 'data'
  parts: any
  attachments?: any
  siteId: string
  createdAt: Date
}

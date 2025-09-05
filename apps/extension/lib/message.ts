import { defineExtensionMessaging } from '@webext-core/messaging'
import { SessionData } from '@penx/types'

interface ProtocolMap {
  translateText: (data: { text: string; from: string; to: string }) => Promise<{
    text: string
    from: string
    to: string
  }>

  chromeAIPrompt: (data: { messages: any }) => any

  logout: (data: {}) => any
  login: (data: { session: SessionData }) => any

  closeSidePanel: (data: {}) => any
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>()

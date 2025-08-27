import { defineExtensionMessaging } from '@webext-core/messaging'

interface ProtocolMap {
  translateText: (data: { text: string; from: string; to: string }) => Promise<{
    text: string
    from: string
    to: string
  }>

  chromeAIPrompt: (data: { messages: any }) => any
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>()

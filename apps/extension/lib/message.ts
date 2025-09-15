import { defineExtensionMessaging } from '@webext-core/messaging'
import { ICreationNode } from '@penx/model-type'
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

  togglePanel: (data: {}) => any

  updateBrowserTab: (data: {}) => any

  setupUserscript: (data: { url: string }) => any

  bookmarkUpdated: () => any

  deleteCreation: (data: { creation: ICreationNode }) => any
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>()

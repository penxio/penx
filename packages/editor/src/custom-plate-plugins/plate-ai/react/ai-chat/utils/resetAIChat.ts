import { getEditorPlugin, type PlateEditor } from '@udecode/plate/react'
import { AIPlugin } from '../../ai/AIPlugin'
import type { AIChatPluginConfig } from '../AIChatPlugin'

export const resetAIChat = (editor: PlateEditor) => {
  const { api, getOptions } = getEditorPlugin<AIChatPluginConfig>(editor, {
    key: 'aiChat',
  })

  api.aiChat.stop()

  const chat = getOptions().chat

  if (chat.messages && chat.messages.length > 0) {
    chat.setMessages?.([])
  }

  editor.getTransforms(AIPlugin).ai.removeNodes()
}

import { getEditorPlugin, type PlateEditor } from '@udecode/plate/react'
import { withAIBatch } from '../../../lib'
import { AIPlugin } from '../../ai/AIPlugin'
import type { AIChatPluginConfig } from '../AIChatPlugin'

export const acceptAIChat = (editor: PlateEditor) => {
  const { tf } = getEditorPlugin(editor, AIPlugin)

  withAIBatch(editor, () => {
    tf.ai.removeMarks()
  })

  editor.getApi<AIChatPluginConfig>({ key: 'ai' }).aiChat.hide()
  editor.tf.focus()
}

import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import { BaseFriendsPlugin, type TFriendsElement } from '../BaseFriendsPlugin'

export const insertFriends = (
  editor: SlateEditor,
  {
    ...options
  }: InsertNodesOptions & {
    icon?: string
    variant?: (string & {}) | TFriendsElement['variant']
  } = {},
) => {
  editor.tf.insertNodes<TFriendsElement>(
    {
      children: [{ text: '' }],
      creationId: '',
      type: editor.getType(BaseFriendsPlugin),
    },
    options as any,
  )
}

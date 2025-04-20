import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import {
  BaseCommentBoxPlugin,
  type TCommentBoxElement,
} from '../BaseCommentBoxPlugin'

export const insertCommentBox = (
  editor: SlateEditor,
  {
    ...options
  }: InsertNodesOptions & {
    icon?: string
    variant?: (string & {}) | TCommentBoxElement['variant']
  } = {},
) => {
  editor.tf.insertNodes<TCommentBoxElement>(
    {
      children: [{ text: '' }],
      creationId: '',
      type: editor.getType(BaseCommentBoxPlugin),
    },
    options as any,
  )
}

import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import {
  BaseSocialLinksPlugin,
  type TSocialLinksElement,
} from '../BaseCommentBoxPlugin'

export const insertSocialLinks = (
  editor: SlateEditor,
  {
    ...options
  }: InsertNodesOptions & {
    icon?: string
    variant?: (string & {}) | TSocialLinksElement['variant']
  } = {},
) => {
  editor.tf.insertNodes<TSocialLinksElement>(
    {
      children: [{ text: '' }],
      creationId: '',
      type: editor.getType(BaseSocialLinksPlugin),
    },
    options as any,
  )
}

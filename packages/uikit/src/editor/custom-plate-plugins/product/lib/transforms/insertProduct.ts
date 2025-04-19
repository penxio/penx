import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import { BaseProductPlugin, type TProductElement } from '../BaseProductPlugin'

export const insertProduct = (
  editor: SlateEditor,
  {
    ...options
  }: InsertNodesOptions & {
    icon?: string
    variant?: (string & {}) | TProductElement['variant']
  } = {},
) => {
  editor.tf.insertNodes<TProductElement>(
    {
      children: [{ text: '' }],
      productId: '',
      type: editor.getType(BaseProductPlugin),
    },
    options as any,
  )
}

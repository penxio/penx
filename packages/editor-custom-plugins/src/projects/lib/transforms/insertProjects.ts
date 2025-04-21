import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import {
  BaseProjectsPlugin,
  type TProjectsElement,
} from '../BaseProjectsPlugin'

export const insertProjects = (
  editor: SlateEditor,
  {
    ...options
  }: InsertNodesOptions & {
    icon?: string
    variant?: (string & {}) | TProjectsElement['variant']
  } = {},
) => {
  editor.tf.insertNodes<TProjectsElement>(
    {
      children: [{ text: '' }],
      creationId: '',
      type: editor.getType(BaseProjectsPlugin),
    },
    options as any,
  )
}

import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import {
  BasePodcastTimePlugin,
  TPodcastTimeElement,
} from '../BasePodcastTimePlugin'

export const insertPodcastTime = (
  editor: SlateEditor,
  point?: string,
  options?: InsertNodesOptions,
) => {
  console.log('insert>>>>>>>>>>>>')

  editor.tf.insertNodes<TPodcastTimeElement>(
    {
      children: [{ text: '' }],
      point: point ?? editor.api.string(editor.selection),
      type: editor.getType(BasePodcastTimePlugin),
    },
    options as any,
  )
}

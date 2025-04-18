import { uniqueId } from '@/lib/unique-id'
import { Editor, Transforms } from 'slate'
import { NodeInsertNodesOptions } from 'slate/dist/interfaces/transforms/node'
import { getEmptyElement } from './getEmptyElement'

export const insertEmptyParagraph = (
  editor: Editor,
  options?: NodeInsertNodesOptions<any>,
) => {
  Transforms.insertNodes(
    editor,
    {
      ...getEmptyElement(),
      id: uniqueId(),
    } as any,
    options,
  )
}

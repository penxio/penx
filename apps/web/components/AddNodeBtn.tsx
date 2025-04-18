import { findNodePath } from '@/lib/findNodePath'
import { selectEditor } from '@/lib/selectEditor'
import { PlusIcon } from 'lucide-react'
import { Path, Transforms } from 'slate'
import { insertEmptyParagraph } from './editor/lib/insertEmptyParagraph'
import { useCreateEditor } from './editor/use-create-editor'

interface Props {
  editor: ReturnType<typeof useCreateEditor>
}

export function AddNodeBtn({ editor }: Props) {
  function add() {
    const node = editor.children[editor.children.length - 1]
    const nodePath = findNodePath(editor as any, node)!
    const at = Path.next(nodePath)
    insertEmptyParagraph(editor as any, { at })
    selectEditor(editor as any, { at, focus: true })
  }

  return (
    <div
      className="bg-foreground/10 hover:bg-foreground/10 text-foreground/40 -ml-2 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full"
      onClick={add}
    >
      <PlusIcon size={14} strokeWidth={1.5} />
    </div>
  )
}

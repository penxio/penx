import { PlusIcon } from 'lucide-react'
import { Path, Transforms } from 'slate'
import { isMobileApp } from '@penx/constants'
import { cn } from '@penx/utils'
// import { insertEmptyParagraph } from '../editor/lib/insertEmptyParagraph'
// import { useCreateEditor } from '../editor/use-create-editor'
import { findNodePath } from '@penx/utils/findNodePath'
import { insertEmptyParagraph } from '@penx/utils/insertEmptyParagraph'
import { selectEditor } from '@penx/utils/selectEditor'

interface Props {
  // editor: ReturnType<typeof useCreateEditor>
  editor: any
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
      className={cn(
        'bg-foreground/10 hover:bg-foreground/10 text-foreground/40 -ml-2 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full',
        isMobileApp && '-ml-0',
      )}
      onClick={add}
    >
      <PlusIcon size={14} strokeWidth={1.5} />
    </div>
  )
}

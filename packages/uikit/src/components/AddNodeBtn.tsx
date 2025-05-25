import { PlusIcon } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
import { cn } from '@penx/utils'

// import { insertEmptyParagraph } from '../editor/lib/insertEmptyParagraph'
// import { useCreateEditor } from '../editor/use-create-editor'

interface Props {
  // editor: ReturnType<typeof useCreateEditor>
  editor: any
}

export function AddNodeBtn({ editor }: Props) {
  function add() {}

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

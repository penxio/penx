import { ReactNode } from 'react'
import {
  AudioLinesIcon,
  BookmarkIcon,
  CheckIcon,
  Columns2Icon,
  FilePenLine,
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  Pen,
  PencilLineIcon,
  PresentationIcon,
  Users2Icon,
  WandSparklesIcon,
} from 'lucide-react'
import { WidgetType } from '@penx/constants'
import { StructType } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  type: string
  className?: string
}

export function StructIcon({ type, className = 'size-4' }: Props) {
  if (type === StructType.ARTICLE) return <FileTextIcon className={className} />
  // if (type === StructType.NOTE) return <Pen size={16} />
  if (type === StructType.NOTE)
    return <span className={cn('icon-[mdi--feather]', className)} />

  if (type === StructType.BOOKMARK) {
    return (
      <span className={cn('icon-[material-symbols--bookmark]', className)} />
    )
  }
  if (type === StructType.IMAGE) {
    return <span className={cn('icon-[mynaui--image-solid]', className)} />
  }

  if (type === StructType.PAGE) {
    return <span className={cn('icon-[iconoir--page]', className)} />
  }

  if (type === StructType.AUDIO) {
    return <span className={cn('icon-[mingcute--voice-line]', className)} />
  }

  if (type === StructType.FRIEND) return <Users2Icon className={className} />

  if (type === StructType.PROJECT)
    return <PresentationIcon className={className} />

  if (type === StructType.VOICE) {
    return <span className={cn('icon-[mingcute--voice-line]', className)} />
  }

  if (type === StructType.TASK) {
    return (
      <span className={cn('icon-[fluent--task-list-20-filled]', className)} />
    )
  }

  if (type === StructType.QUICK_LINK) {
    return <span className={cn('icon-[solar--link-bold]', className)} />
  }

  if (type === StructType.SNIPPET) {
    return (
      <span
        className={cn(
          'icon-[material-symbols--text-snippet-rounded]',
          className,
        )}
      />
    )
  }

  if (type === StructType.PROMPT) {
    return <span className={cn('icon-[fluent--prompt-16-filled]', className)} />
  }

  if (type === StructType.AI_COMMAND) {
    return <span className={cn('icon-[mingcute--ai-fill]', className)} />
  }

  return null
}

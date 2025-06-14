import { ReactNode } from 'react'
import {
  AudioLinesIcon,
  BookmarkIcon,
  CheckIcon,
  Columns2Icon,
  FilePenLine,
  FileTextIcon,
  ImageIcon,
  Pen,
  PencilLineIcon,
  PresentationIcon,
  Users2Icon,
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
    return <span className={cn('icon-[mdi--feather]', className)}></span>

  if (type === StructType.BOOKMARK)
    return <BookmarkIcon className={className} />
  if (type === StructType.IMAGE) return <ImageIcon className={className} />
  if (type === StructType.PAGE) return <Columns2Icon className={className} />
  if (type === StructType.AUDIO) return <AudioLinesIcon className={className} />
  if (type === StructType.FRIEND) return <Users2Icon className={className} />
  if (type === StructType.PROJECT)
    return <PresentationIcon className={className} />
  if (type === StructType.VOICE) return <AudioLinesIcon className={className} />

  if (type === StructType.TASK) return <CheckIcon className={className} />

  return null
}

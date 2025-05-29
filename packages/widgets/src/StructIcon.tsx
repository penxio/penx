import { ReactNode } from 'react'
import {
  AudioLinesIcon,
  BookmarkIcon,
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

export function StructIcon({ type, className }: Props) {
  if (type === StructType.ARTICLE)
    return <FileTextIcon size={16} className={className} />
  // if (type === StructType.NOTE) return <Pen size={16} />
  if (type === StructType.NOTE)
    return <span className={cn('icon-[mdi--feather] size-5', className)}></span>

  if (type === StructType.BOOKMARK)
    return <BookmarkIcon size={16} className={className} />
  if (type === StructType.IMAGE)
    return <ImageIcon size={16} className={className} />
  if (type === StructType.PAGE)
    return <Columns2Icon size={16} className={className} />
  if (type === StructType.AUDIO)
    return <AudioLinesIcon size={16} className={className} />
  if (type === StructType.FRIEND)
    return <Users2Icon size={16} className={className} />
  if (type === StructType.PROJECT)
    return <PresentationIcon size={16} className={className} />
  if (type === StructType.VOICE)
    return <AudioLinesIcon size={16} className={className} />

  if (type === StructType.TASK)
    return (
      <span
        className={cn('icon-[mdi--checkbox-outline] size-5', className)}
      ></span>
    )

  return null
}

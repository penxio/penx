import { ReactNode } from 'react'
import { Trans } from '@lingui/react'
import { Mold } from '@prisma/client'
import {
  AudioLinesIcon,
  BookmarkIcon,
  Columns2Icon,
  FileText,
  ImageIcon,
  Pen,
  PresentationIcon,
  Users2Icon,
} from 'lucide-react'
import { CreationType } from '@penx/types'

export function getCreationIcon(type: any): ReactNode {
  if (type === CreationType.ARTICLE) return <FileText size={16} />
  if (type === CreationType.NOTE) return <Pen size={16} />
  if (type === CreationType.BOOKMARK) return <BookmarkIcon size={16} />
  if (type === CreationType.IMAGE) return <ImageIcon size={16} />
  if (type === CreationType.PAGE) return <Columns2Icon size={16} />
  if (type === CreationType.AUDIO) return <AudioLinesIcon size={16} />
  if (type === CreationType.FRIEND) return <Users2Icon size={16} />
  if (type === CreationType.PROJECT) return <PresentationIcon size={16} />

  if (type === CreationType.TASK)
    return <span className="icon-[mdi--checkbox-outline] size-5"></span>

  return null
}

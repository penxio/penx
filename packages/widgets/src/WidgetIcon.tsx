import {
  BotMessageSquareIcon,
  CalendarIcon,
  FilePenLine,
  GroupIcon,
  PencilLineIcon,
  Rows4Icon,
  StarIcon,
} from 'lucide-react'
import { WidgetType } from '@penx/constants'
import { Mold } from '@penx/db/client'

interface Props {
  type: string
  molds: Mold[]
}

export function WidgetIcon({ type, molds }: Props) {
  if (type === WidgetType.ALL_CREATIONS) {
    return <Rows4Icon size={16} />
  }

  if (type === WidgetType.COLLECTION) {
    return <GroupIcon size={16} />
  }

  if (type === WidgetType.FAVORITES) {
    return <StarIcon size={16} />
  }
  if (type === WidgetType.RECENTLY_EDITED) {
    return <FilePenLine size={16} />
  }
  if (type === WidgetType.RECENTLY_OPENED) {
    return <CalendarIcon size={16} />
  }

  if (type === WidgetType.AI_CHAT) {
    return <BotMessageSquareIcon size={16} />
  }

  if (type === WidgetType.QUICK_INPUT) {
    return <PencilLineIcon size={16} />
  }
  return null
}

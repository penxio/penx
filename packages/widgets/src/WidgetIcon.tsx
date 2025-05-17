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
import { Struct } from '@penx/domain'

interface Props {
  type: string
  structs: Struct[]
}

export function WidgetIcon({ type, structs }: Props) {
  if (type === WidgetType.ALL_STRUCTS) {
    return <span className="icon-[mdi--shape-outline] size-5"></span>
  }

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

  return null
}

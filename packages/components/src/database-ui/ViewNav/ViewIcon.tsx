'use client'

import { ViewType } from '@penx/types'
import {
  CalendarDays,
  Home,
  KanbanSquare,
  LayoutGrid,
  List,
  Table,
} from 'lucide-react'

interface Props {
  index?: number
  viewType: `${ViewType}`
  size?: number
}

export const ViewIcon = ({ viewType, size = 16, index }: Props) => {
  const iconsMap: Record<ViewType, any> = {
    [ViewType.TABLE]: Table,
    [ViewType.LIST]: List,
    [ViewType.GALLERY]: LayoutGrid,
    [ViewType.KANBAN]: KanbanSquare,
    [ViewType.CALENDAR]: CalendarDays,
  }
  let Icon = iconsMap[viewType]

  if (index === 0) Icon = Home

  if (Icon)
    return (
      <div className="text-foreground/50 inline-flex">
        <Icon size={size} />
      </div>
    )
  return null
}

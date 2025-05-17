'use client'

import {
  CalendarDays,
  Home,
  KanbanSquare,
  LayoutGrid,
  List,
  Table,
} from 'lucide-react'
import { ViewType } from '@penx/types'

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

  if (Icon) return <Icon size={size} />
  return null
}

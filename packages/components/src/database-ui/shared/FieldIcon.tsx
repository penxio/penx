'use client'

import { ColumnType } from '@penx/types'
import {
  CalendarDays,
  CheckCircle2,
  Hash,
  Home,
  Image,
  Key,
  Link,
  ListChecks,
  Text,
} from 'lucide-react'

interface Props {
  index?: number
  // columnType: `${FieldType}`
  columnType: any
  size?: number
}

export const FieldIcon = ({
  columnType: fieldType,
  size = 16,
  index,
}: Props) => {
  const iconsMap: Record<string, any> = {
    [ColumnType.TEXT]: Text,
    [ColumnType.NUMBER]: Hash,
    [ColumnType.URL]: Link,
    [ColumnType.PASSWORD]: Key,
    [ColumnType.SINGLE_SELECT]: CheckCircle2,
    [ColumnType.MULTIPLE_SELECT]: ListChecks,
    [ColumnType.MARKDOWN]: Text,
    [ColumnType.IMAGE]: Image,
    [ColumnType.DATE]: CalendarDays,
    [ColumnType.CREATED_AT]: CalendarDays,
    [ColumnType.UPDATED_AT]: CalendarDays,
  }
  let Icon = iconsMap[fieldType]

  if (index === 0) Icon = Home

  if (Icon)
    return (
      <div className="text-foreground/500 inline-flex">
        <Icon size={size} />
      </div>
    )
  return null
}

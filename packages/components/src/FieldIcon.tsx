'use client'

import {
  CalendarDays,
  CheckCircle2,
  Hash,
  Home,
  Image,
  Key,
  Link,
  ListChecks,
  StarIcon,
  Text,
} from 'lucide-react'
import { ColumnType } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  index?: number
  // columnType: `${FieldType}`
  columnType: any
  size?: number
  className?: string
}

export const FieldIcon = ({
  columnType: fieldType,
  size = 16,
  index,
  className,
}: Props) => {
  const iconsMap: Record<string, any> = {
    [ColumnType.PRIMARY]: Text,
    [ColumnType.TEXT]: Text,
    [ColumnType.NUMBER]: Hash,
    [ColumnType.URL]: Link,
    [ColumnType.PASSWORD]: Key,
    [ColumnType.SINGLE_SELECT]: CheckCircle2,
    [ColumnType.MULTIPLE_SELECT]: ListChecks,
    [ColumnType.MARKDOWN]: Text,
    [ColumnType.RATE]: StarIcon,
    [ColumnType.IMAGE]: Image,
    [ColumnType.DATE]: CalendarDays,
    [ColumnType.CREATED_AT]: CalendarDays,
    [ColumnType.UPDATED_AT]: CalendarDays,
  }
  let Icon = iconsMap[fieldType]

  if (index === 0) Icon = Home

  if (Icon)
    return (
      <Icon
        size={size}
        className={cn('text-foreground/70 inline-flex', className)}
      />
    )
  return null
}

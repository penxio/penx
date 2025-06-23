'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { Creation, Struct } from '@penx/domain'
import { isReminder } from '@penx/libs/isReminder'

interface Props {
  creation: Creation
  struct: Struct
}

export function CreationReminder({ creation, struct }: Props) {
  const column = struct.columns.find((c) => c.slug === 'reminder')
  if (!column) return null

  const value = creation?.cells?.[column.id]
  if (!value) return null
  if (!isReminder(value)) return null

  const date = value.date!
  const content = useMemo(() => {
    if (format(date, 'MM-dd') === format(new Date(), 'MM-dd')) {
      return format(date, 'HH:mm')
    }
    return format(date, 'MM/dd')
  }, [value])
  return <div className="text-foreground/60 text-xs">{content}</div>
}

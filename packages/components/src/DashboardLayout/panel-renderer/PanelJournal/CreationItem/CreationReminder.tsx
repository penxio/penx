'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { Creation, Struct } from '@penx/domain'

interface Props {
  creation: Creation
  struct: Struct
}

export function CreationReminder({ creation, struct }: Props) {
  const column = struct.columns.find((c) => c.slug === 'reminder')
  if (!column) return null

  const value = creation.cells[column.id]
  if (!value) return null
  if (!(value instanceof Date)) return null

  const content = useMemo(() => {
    if (format(value, 'MM-dd') === format(new Date(), 'MM-dd')) {
      return format(value, 'HH:mm')
    }
    return format(value, 'MM/dd')
  }, [value])
  return <div className="text-foreground/60 text-xs">{content}</div>
}

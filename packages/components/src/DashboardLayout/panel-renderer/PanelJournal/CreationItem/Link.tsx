'use client'

import { ArrowUpRight } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { ColumnType } from '@penx/types'

interface Props {
  creation: Creation
  struct: Struct
}

export function Link({ creation, struct }: Props) {
  const column = struct.columns.find((c) => c.columnType === ColumnType.URL)
  if (!column) return null
  return (
    <div>
      <a
        href={creation.cells[column.id]}
        target="_blank"
        className="text-brand inline-flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="break-all">{creation.cells[column.id]}</div>
        <ArrowUpRight size={20} />
      </a>
    </div>
  )
}

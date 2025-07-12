import { useMemo } from 'react'
import { Creation, Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { NovelEditor } from '@penx/novel-editor/NovelEditor'
import { ColumnType } from '@penx/types'
import { Badge } from '@penx/uikit/ui/badge'

interface Props {
  struct: Struct
  creation: Creation
  sortedColumns: IColumn[]
}

export function RowProps({ struct, creation, sortedColumns }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 p-2">
        <NovelEditor editable={false} value={JSON.parse(creation.content)} />
      </div>
      <div className="border-foreground/6 divide-foreground/5 flex flex-col gap-2 divide-y border-t px-2 py-2">
        {sortedColumns.map((column) => (
          <Item key={column.id} column={column} creation={creation} />
        ))}
      </div>
    </div>
  )
}

interface ItemProps {
  creation: Creation
  column: IColumn
}

export function Item({ column, creation }: ItemProps) {
  const getValue = () => {
    if (!creation.cells) return null
    const v = creation.cells[column.id]

    if (column.isPrimary) return <div className="text-sm">{creation.title}</div>

    if (
      column.columnType === ColumnType.SINGLE_SELECT ||
      column.columnType === ColumnType.MULTIPLE_SELECT
    ) {
      const arr = v as string[]
      return (
        <div className="flex items-center gap-1">
          {arr.map((i) => {
            const option = column.options.find((o) => o.id === i)
            return <Badge key={i}>{option?.name}</Badge>
          })}
        </div>
      )
    }
    return <div className="text-sm">{v}</div>
  }

  return (
    <div key={column.id} className="flex h-6 items-center justify-between">
      <div className="text-foreground/60 text-xs font-semibold">
        {column.name}
      </div>
      {getValue()}
    </div>
  )
}

import { Creation } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { IColumn } from '@penx/model-type'
import { NovelEditor } from '@penx/novel-editor/NovelEditor'
import { ColumnType } from '@penx/types'
import { Badge } from '@penx/uikit/ui/badge'
import { mappedByKey } from '@penx/utils'
import { CreationImage } from './CreationImage'

interface Props {
  creation: Creation
}

export function CreationDetail({ creation }: Props) {
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === creation.structId)!
  if (!struct) return null
  const currentView = struct.views[0]
  const viewColumns = currentView.viewColumns
  const columnMap = mappedByKey(struct.columns, 'id')
  const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 p-2">
        {struct.isImage ? (
          <CreationImage creation={creation} />
        ) : (
          <NovelEditor editable={false} value={creation.content} />
        )}
      </div>
      <div className="border-foreground/6 divide-foreground/5 flex flex-col divide-y border-t px-2">
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
      if (!v) return null
      const arr: string[] = Array.isArray(v) ? v : [v]
      if (!arr) return null
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
    <div
      key={column.id}
      className="bg-gre flex h-9 items-center justify-between gap-2"
    >
      <div className="text-foreground/60 lean shrink-0 text-xs font-semibold">
        {column.name}
      </div>
      {getValue()}
    </div>
  )
}

import { Creation, Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'

interface Props {
  struct: Struct
  creation: Creation
  sortedColumns: IColumn[]
}
export function RowProps({ struct, creation, sortedColumns }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-2">Todo</div>

      <div className="flex flex-col gap-2 border-t border-foreground/6 px-2 py-2 divide-foreground/5 divide-y">
        {sortedColumns.map((column) => {
          return (
            <div key={column.id} className="flex items-center justify-between h-6">
              <div className="text-xs font-semibold text-foreground/60">{column.name}</div>
              {creation.cells && <div className="text-sm">{creation.cells[column.id]}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

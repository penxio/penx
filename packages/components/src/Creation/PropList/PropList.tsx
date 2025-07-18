import { Struct } from '@penx/domain'
import { PropItem } from './PropItem'

interface Props {
  struct: Struct
  onUpdateProps: (cells: any) => void
}

export const PropList = ({ struct, onUpdateProps }: Props) => {
  if (!struct) return null

  if (struct.columns.length < 2) return null
  return (
    <div className="mt-4 flex flex-col gap-1">
      {struct.columns.map((column, i) => {
        return (
          <PropItem
            key={column.id}
            column={column}
            onUpdateProps={onUpdateProps}
          />
        )
      })}
    </div>
  )
}

import { usePanelCreationContext } from '@penx/components/Creation/PanelCreationProvider'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { Card } from '../ui/Card'
import { PropItem } from './PropItem'

interface Props {
  cells: any
  struct: Struct
  onUpdateProps: (cells: any) => void
}

export const MobilePropList = ({ cells, struct, onUpdateProps }: Props) => {
  return (
    <Card className="mb-3 mt-4 flex flex-col">
      {struct.columns.map((column, i) => {
        return (
          <PropItem
            key={column.id}
            cells={cells}
            struct={struct}
            column={column}
            onUpdateProps={onUpdateProps}
          />
        )
      })}
    </Card>
  )
}

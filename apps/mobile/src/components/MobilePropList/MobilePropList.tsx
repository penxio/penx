import { usePanelCreationContext } from '@penx/components/Creation/PanelCreationProvider'
import { useStructs } from '@penx/hooks/useStructs'
import { Card } from '../ui/Card'
import { PropItem } from './PropItem'

interface Props {
  onUpdateProps: (cells: any) => void
}

export const MobilePropList = ({ onUpdateProps }: Props) => {
  const creation = usePanelCreationContext()
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === creation.structId)!

  if (struct.columns.length < 2) return null
  return (
    <Card className="mb-3 mt-4 flex flex-col">
      {struct.columns.map((column, i) => {
        return (
          <PropItem
            key={column.id}
            column={column}
            onUpdateProps={onUpdateProps}
          />
        )
      })}
    </Card>
  )
}

import { useStructs } from '@penx/hooks/useStructs'
import { usePanelCreationContext } from './PanelCreationProvider'
import { PropItem } from './PropItem'

interface Props {
  onUpdateProps: (cells: any) => void
}

export const PropList = ({ onUpdateProps }: Props) => {
  const creation = usePanelCreationContext()
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === creation.structId)!

  if (!struct.columns.length) return null
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

import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { getBgColor } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'

interface Props {
  onSelect: (struct: Struct) => void
}

export function StructList({ onSelect }: Props) {
  const { structs } = useStructs()
  return (
    <div className="flex  flex-wrap gap-2 px-1 pb-2">
      {structs.map((struct) => (
        <div
          key={struct.id}
          className={cn(
            'text-foreground hover:bg-foreground/5 border-foreground/10 inline-flex cursor-pointer items-center justify-between gap-2 rounded-full border px-5 py-2 text-xl font-bold',
          )}
          onClick={() => onSelect(struct)}
        >
          <span
            className={cn('size-2 rounded-full', getBgColor(struct.color))}
          ></span>
          <div>{struct.name}</div>
        </div>
      ))}
    </div>
  )
}

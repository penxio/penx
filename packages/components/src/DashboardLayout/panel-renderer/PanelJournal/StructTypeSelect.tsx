import { useState } from 'react'
import { MoreHorizontalIcon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { cn } from '@penx/utils'

interface Props {
  value: Struct
  onChange: (value: Struct) => void
}
export const StructTypeSelect = ({ value, onChange }: Props) => {
  const { structs } = useStructs()
  const suggestions = structs.slice(0, 3)
  const rest = structs.slice(3)
  const [other, setOther] = useState<Struct | null>(null)
  if (other) suggestions.push(other)

  return (
    <div className="flex items-center gap-1">
      {suggestions.map((struct, index) => (
        <div
          key={struct.id}
          className={cn(
            'hover:border-brand hover:text-brand flex h-6 cursor-pointer items-center rounded-full border px-2 text-xs',
            value.id == struct.id && 'border-brand text-brand',
          )}
          onClick={() => {
            if (struct.id === other?.id) return
            onChange(struct)
            setOther(null)
          }}
        >
          {struct.name}
        </div>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="hover:border-brand hover:text-brand flex h-6 cursor-pointer items-center rounded-full border px-2 text-xs">
            <MoreHorizontalIcon size={20} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" side="top" align="end" sideOffset={4}>
          {rest.map((struct) => (
            <DropdownMenuItem
              key={struct.id}
              onClick={async () => {
                onChange(struct)
                setOther(struct)
              }}
            >
              {struct.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

import { useState } from 'react'
import { MoreHorizontalIcon } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
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
  onOpenChange: (isOpen: boolean) => void
}
export const StructTypeSelect = ({ value, onChange, onOpenChange }: Props) => {
  const { structs } = useStructs()
  const [open, setOpen] = useState(false)
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
            'hover:text-brand bg-foreground/5 flex h-6 cursor-pointer items-center rounded-full px-2 text-xs',
            value.id == struct.id && 'text-brand',
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

      {!isMobileApp && (
        <DropdownMenu
          open={open}
          onOpenChange={(v) => {
            setOpen(v)
            onOpenChange(v)
          }}
        >
          <DropdownMenuTrigger asChild>
            <div className="hover:text-brand flex h-6 cursor-pointer items-center rounded-full px-2 text-xs">
              <MoreHorizontalIcon size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className=""
            side="top"
            align="end"
            sideOffset={4}
          >
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
      )}
    </div>
  )
}

import { Maximize2Icon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'
import { Button } from '@penx/uikit/ui/button'
import { uniqueId } from '@penx/unique-id'

interface Props {
  onSelect: (struct: Struct) => void
}

export function StructList({ onSelect }: Props) {
  const { structs } = useStructs()
  return (
    <div className="flex flex-col gap-0.5 px-1 pb-2">
      {structs.map((struct) => (
        <div
          key={struct.id}
          className="text-foreground hover:bg-foreground/5 group/struct flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-sm font-semibold"
          onClick={() => onSelect(struct)}
        >
          <div>{struct.name}</div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="hover:bg-foreground/10 size-6 rounded-md"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    store.panels.openStruct(struct.id)
                  }}
                >
                  <Maximize2Icon
                    size={16}
                    className="text-foreground/60 hidden transition-all group-hover/struct:block"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in new panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  )
}

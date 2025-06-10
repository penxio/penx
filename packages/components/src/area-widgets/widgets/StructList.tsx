import { Maximize2Icon } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
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
import { cn } from '@penx/utils'
import { ColorfulStructIcon } from '../../ColorfulStructIcon'

interface Props {
  onSelect: (struct: Struct) => void
}

export function StructList({ onSelect }: Props) {
  const { structs } = useStructs()
  return (
    <div
      className={cn('flex flex-col gap-0.5 px-1 pb-2', isMobileApp && 'px-0')}
    >
      {structs.map((struct) => (
        <div
          key={struct.id}
          className={cn(
            'text-foreground hover:bg-foreground/5 group/struct flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm',
            isMobileApp && 'px-0 text-base',
          )}
          onClick={() => onSelect(struct)}
        >
          <ColorfulStructIcon
            struct={struct}
            className="size-6"
            emojiSize={16}
          />
          <div>{struct.name}</div>

          {/* <TooltipProvider>
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
          </TooltipProvider> */}
        </div>
      ))}
    </div>
  )
}

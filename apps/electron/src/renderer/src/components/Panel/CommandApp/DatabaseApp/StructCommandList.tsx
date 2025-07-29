import { PlusIcon } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { Button } from '@penx/uikit/ui/button'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { cn } from '@penx/utils'
import { useFilterPopover } from '~/hooks/useFilterPopover'
import { creationToCommand } from '~/lib/creationToCommand'
import { CommandGroup } from '../../CommandComponents'
import { getLabel } from '../../FilterPopover'
import { ListItemUI } from '../../ListItemUI'

interface Props {
  struct: Struct
  creations: Creation[]
}

export function StructCommandList({ creations }: Props) {
  const { value } = useFilterPopover()

  return (
    <CommandGroup
      heading={
        <div className="mt-1 flex h-6 items-center gap-1">
          <div>{getLabel(value)}</div>
          <PlusIcon
            size={18}
            className="text-foreground/60 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
            }}
          />
        </div>
      }
      className={cn(
        'm-0 flex-[2] overflow-auto px-2 pb-2 pt-0',
        // struct.isTask && 'flex-[2]',
      )}
      style={{
        overscrollBehavior: 'contain',
        scrollPaddingBlockStart: 8,
        scrollPaddingBlockEnd: 8,
        position: 'relative',
      }}
    >
      {creations.map((item, index) => {
        return (
          <ListItemUI
            key={index}
            prefix={
              item.isTask ? (
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={item.checked}
                  onCheckedChange={(v) => {
                    updateCreationProps(item.id, {
                      checked: v as any,
                    })
                  }}
                />
              ) : null
            }
            index={index}
            showIcon={false}
            value={item.id}
            item={creationToCommand(item)}
          />
        )
      })}
    </CommandGroup>
  )
}

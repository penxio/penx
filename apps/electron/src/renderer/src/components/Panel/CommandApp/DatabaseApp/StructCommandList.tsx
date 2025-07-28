import { Creation, Struct } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { cn } from '@penx/utils'
import { creationToCommand } from '~/lib/creationToCommand'
import { CommandGroup } from '../../CommandComponents'
import { ListItemUI } from '../../ListItemUI'

interface Props {
  struct: Struct
  creations: Creation[]
}

export function StructCommandList({ creations }: Props) {
  return (
    <CommandGroup
      className={cn(
        'flex-[2] overflow-auto p-2',
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

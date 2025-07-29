import { useMemo } from 'react'
import { addDays, format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { TaskNav } from '@penx/constants'
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

export function StructCommandList({ creations, struct }: Props) {
  const { value } = useFilterPopover()

  return (
    <CommandGroup
      className={cn(
        'm-0 flex-[2] overflow-auto px-2 pb-2 pt-0',
        !struct.isTask && 'mt-2',
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

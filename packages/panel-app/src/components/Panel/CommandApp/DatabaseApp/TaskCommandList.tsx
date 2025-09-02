import { useMemo, useState } from 'react'
import { addDays, format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { TaskNav } from '@penx/constants'
import { Creation, Struct } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { Button } from '@penx/uikit/ui/button'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { useFilterPopover } from '../../../../hooks/useFilterPopover'
import { creationToCommand } from '../../../../lib/creationToCommand'
import { CommandGroup } from '../../CommandComponents'
import { getLabel } from '../../FilterPopover'
import { ListItemUI } from '../../ListItemUI'

interface Props {
  struct: Struct
  creations: Creation[]
}

export function TaskCommandList({ creations, struct }: Props) {
  const { value } = useFilterPopover()
  const [open, setOpen] = useState(false)
  const heading = useMemo(() => {
    if (!struct.isTask) return undefined
    const canAdd = [TaskNav.TODAY, TaskNav.TOMORROW].includes(value)
    const dateDelta = value === TaskNav.TODAY ? 0 : 1
    const date = format(addDays(new Date(), dateDelta), 'yyyy-MM-dd')
    return (
      <div className="mt-2 flex h-6 items-center gap-1 px-2">
        <div>{getLabel(value)}</div>
        {/* {canAdd && (
          <PlusIcon
            size={18}
            className="text-foreground/60 cursor-pointer"
            onClick={(e) => {
              alert('eer')
              setOpen(true)
              // e.stopPropagation()
            }}
          />
        )} */}
      </div>
    )
  }, [struct, value])

  const filteredCreations = useMemo(() => {
    if (value === TaskNav.TODAY) {
      return creations.filter(
        (c) => c.date === format(new Date(), 'yyyy-MM-dd'),
      )
    }
    if (value === TaskNav.TOMORROW) {
      return creations.filter(
        (c) => c.date === format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      )
    }
    return creations
  }, [creations, value])

  return (
    <CommandGroup
      heading={heading}
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
      {filteredCreations.map((item, index) => {
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

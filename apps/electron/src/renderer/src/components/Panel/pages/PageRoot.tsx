import { ReactNode } from 'react'
import { Command } from 'cmdk'
import { useActionPopover } from '~/hooks/useActionPopover'
import { useItems } from '~/hooks/useItems'
import { useSelectStruct } from '~/hooks/useSelectStruct'
import { ICommandItem } from '~/lib/types'
import { CommandList } from '../CommandComponents'
import { ListItemUI } from '../ListItemUI'

export function PageRoot() {
  const { commandItems } = useItems()
  const selectStruct = useSelectStruct()
  return (
    <CommandList className="p-2 outline-none">
      <ListGroup
        heading={''}
        items={commandItems}
        onSelect={(item) => selectStruct(item)}
      />
    </CommandList>
  )
}

interface ListGroupProps {
  heading: ReactNode
  items: ICommandItem[]
  onSelect?: (item: ICommandItem) => void
}

function ListGroup({ heading, items, onSelect }: ListGroupProps) {
  const { setOpen } = useActionPopover()
  return (
    <Command.Group heading={heading}>
      {items.map((item, index) => {
        return (
          <ListItemUI
            key={index}
            index={index}
            value={item.data?.struct?.id || item.data.commandName}
            item={item}
            onSelect={onSelect}
            onContextMenu={() => {
              setOpen(true)
            }}
          />
        )
      })}
    </Command.Group>
  )
}

import { useState } from 'react'
import { Command } from 'cmdk'
import { Struct } from '@penx/domain'
import { getBgColor } from '@penx/libs/color-helper'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { Option } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { OptionTag } from '../OptionTag'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

interface Props {
  struct: Struct
  column: IColumn
  value: string[]
  onChange: (ids: string[]) => void
}
export const MultipleSelectProp = ({
  column,
  struct,
  value,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')

  const options = column.options || []
  const currentIds = options.map((o) => o.id)

  const filteredOptions = options.filter((o) => {
    return o.name.toLowerCase().includes(search.toLowerCase())
  })

  if (search.length && filteredOptions.length === 0) {
    filteredOptions.push({
      id: 'CREATE',
      name: search,
    } as Option)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="hover:bg-foreground/5 flex h-10 w-full max-w-[600px] items-center gap-2 rounded-lg px-3">
          {options.map((o) => {
            if (!value.includes(o.id)) return null
            return (
              <div
                key={o.id}
                className={cn(
                  'rounded-full px-2 py-0.5 text-white',
                  getBgColor(o.color),
                )}
              >
                {o.name}
              </div>
            )
          })}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 "
        align="start"
      >
        <Command
          label=""
          value={q}
          className=""
          onSelect={(v) => {
            // console.log('select value====:', v)
          }}
          onValueChange={(v) => {
            setQ(v)
          }}
          shouldFilter={false}
          filter={() => {
            return 1
          }}
        >
          <CommandInput
            autoFocus
            className=""
            placeholder="Find or create option"
            value={search}
            onValueChange={(v) => {
              setSearch(v)
            }}
          />
          <Command.List>
            <Command.Empty className="text-foreground/40 py-2 text-center">
              No results found.
            </Command.Empty>
            <CommandGroup heading={''}>
              {filteredOptions.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={async (v) => {
                    let id = item.id
                    let newOption: Option = undefined as any
                    if (item.id === 'CREATE') {
                      newOption = await store.structs.addOption(
                        struct,
                        column.id,
                        search,
                      )
                      id = newOption.id
                    }

                    let newIds = value

                    const existed = newIds.includes(id)
                    if (!existed) {
                      newIds = [...newIds, id]
                    } else {
                      newIds = newIds.filter((id2) => id2 !== id)
                    }

                    onChange(newIds)
                    setSearch('')
                    setOpen(false)
                  }}
                >
                  {item.id === 'CREATE' && (
                    <div className="text-foreground/80 text-sm">Create</div>
                  )}

                  <OptionTag
                    option={{
                      id: item.id,
                      name: item?.name,
                      color: item?.color,
                    }}
                    showClose={currentIds.includes(item.id)}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

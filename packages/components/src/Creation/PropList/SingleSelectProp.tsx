import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Command } from 'cmdk'
import { Struct } from '@penx/domain'
import { getBgColor } from '@penx/libs/color-helper'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { Option } from '@penx/types'
import { Input } from '@penx/uikit/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { OptionTag } from '../../OptionTag'
import { CommandGroup, CommandInput, CommandItem } from '../command-components'

interface Props {
  struct: Struct
  column: IColumn
  value: string[]
  isPanel?: boolean
  onChange: (ids: string[]) => void
}
export const SingleSelectProp = ({
  column,
  struct,
  value = [],
  isPanel,
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

  const currentOptions = options.filter((o) => value.includes(o.id))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'hover:bg-foreground/5 flex h-10 w-full max-w-[600px] cursor-pointer items-center rounded-lg px-3',
            isPanel && 'h-8 w-auto rounded-md',
          )}
        >
          {!currentOptions.length && (
            <span className="text-foreground/40">
              <Trans>Empty</Trans>
            </span>
          )}
          {currentOptions.map((o) => {
            return (
              <div
                key={o.id}
                className={cn(
                  'cursor-pointer rounded-full px-2 py-0.5 text-sm text-white flex items-center',
                  getBgColor(o.color),
                  isPanel && 'text-xs h-6',
                )}
              >
                {o.name}
              </div>
            )
          })}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0',
          !isPanel && 'w-[var(--radix-popover-trigger-width)]',
          isPanel && 'w-40',
        )}
        side={isPanel ? 'left' : undefined}
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
            placeholder={t`Find or create option`}
            value={search}
            onValueChange={(v) => {
              setSearch(v)
            }}
          />
          <Command.List>
            <Command.Empty className="text-foreground/40 py-2 text-center">
              <Trans>No results found.</Trans>
            </Command.Empty>
            <CommandGroup heading={''}>
              {filteredOptions.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={async (v) => {
                    let id = item.id
                    let newOption: Option = undefined as any
                    if (item.id === 'CREATE') {
                      const res = await store.structs.addOption(
                        struct,
                        column.id,
                        { name: search },
                      )

                      newOption = res.newOption
                      id = newOption.id
                    }
                    const isDelete = id === currentOptions?.[0]?.id
                    onChange(isDelete ? [] : [id])
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
                    // showClose={currentIds.includes(item.id)}
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

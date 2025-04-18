import { useState } from 'react'
import { Command } from 'cmdk'
import { CommandGroup, CommandInput, CommandItem } from './command-components'

export const SingleSelectProp = () => {
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  return (
    <Command
      label="Command Menu"
      value={q}
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
          <CommandItem onSelect={async (v) => {}}>
            <div>AA</div>
          </CommandItem>
          <CommandItem onSelect={async (v) => {}}>
            <div>BB</div>
          </CommandItem>
        </CommandGroup>
      </Command.List>
    </Command>
  )
}

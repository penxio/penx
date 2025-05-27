import { Command } from 'cmdk'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'
import { useCommands } from './useCommands'
import { Trans } from '@lingui/react/macro'

const CommandItem = Command.Item

interface Props {}

export function CommandList({}: Props) {
  const { close } = useOpen()
  const { commands } = useCommands()
  const { search, setSearch } = useSearch()
  const q = search.replace(/^>(\s+)?/, '').toLowerCase()

  const filteredItems = commands.filter((i) => {
    if (!q) return true
    // return (
    //   i.name.toLowerCase().includes(search) ||
    //   i.id.toLowerCase().includes(search)
    // )
    return true
  })

  if (!filteredItems.length) {
    return (
      <div className="flex h-[64px] items-center text-sm">
        <Trans>No results found.</Trans>
      </div>
    )
  }

  return (
    <>
      {filteredItems.map((item, i) => (
        <CommandItem
          key={i}
          className="flex h-10 cursor-pointer items-center rounded-lg px-2 transition-all"
          // value={item.id}
          value={'TODO'}
          onSelect={() => {
            close()
            // item.handler()
            setSearch('')
          }}
          onClick={() => {
            // item.handler()
            // setSearch('')
          }}
        >
          {/* {item.name} */}
          TODO:...
        </CommandItem>
      ))}
    </>
  )
}

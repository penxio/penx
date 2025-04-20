import { useMemo } from 'react'
import { usePaletteDrawer } from '@penx/hooks'
import { useDatabases } from '@penx/hooks/useDatabases'
import { bgColorMaps } from '@penx/libs/color-helper'
import { useRouter } from '@penx/libs/i18n'
import { cn } from '@penx/utils'
import { LoadingDots } from '../icons/loading-dots'
import { CommandGroup, CommandItem } from './command-components'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'

interface Props {
  heading?: string
  isRecent?: boolean
}

export function SearchDatabaseList({ heading = '', isRecent }: Props) {
  const { close } = useOpen()
  const { data = [], isLoading } = useDatabases()
  const databases = isRecent ? data.slice(0, 3) : data

  const { search, setSearch } = useSearch()
  const q = search.replace(/^#(\s+)?/, '') || ''
  const regex = /^(\S+)\s?(.*)?$/
  const [_, tag, text] = q.match(regex) || []
  const paletteDrawer = usePaletteDrawer()
  const { push } = useRouter()

  const filteredItems = useMemo(() => {
    if (!q) return databases
    const items = databases.filter(({ name = '' }) => {
      return name?.toLowerCase().includes(tag.toLowerCase())
    })
    const canSearchALlNodesByTag = /^#(\S)+\s$/.test(q)

    if (!text && !canSearchALlNodesByTag) return items
    return items
  }, [databases, q, tag, text])

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!filteredItems.length && isRecent) {
    return null
  }

  if (!filteredItems.length) {
    return (
      <div className="flex h-16 items-center justify-center text-sm">
        No results found.
      </div>
    )
  }

  return (
    <CommandGroup heading={heading}>
      {filteredItems.map((item) => {
        return (
          <CommandItem
            key={item.id}
            value={item.id}
            className=""
            onSelect={() => {
              paletteDrawer?.close()
              close()
              setSearch('')
              push(`/~/database?id=${item.id}`)
            }}
          >
            <span
              className={cn(
                'text-background flex h-5 w-5 items-center justify-center rounded-full text-sm',
                bgColorMaps[item.color!] || 'bg-foreground/50',
              )}
            >
              #
            </span>

            {item.name || 'Untitled'}
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}

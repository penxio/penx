import { Dispatch, SetStateAction, useMemo } from 'react'
import { File } from 'lucide-react'
import { useCreations } from '@penx/hooks/useCreations'
import { usePaletteDrawer } from '@penx/hooks/usePaletteDrawer'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { CommandGroup, CommandItem } from './command-components'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'

interface Props {
  heading?: string
  isRecent?: boolean
}

export function SearchCreationList({ heading = '', isRecent = false }: Props) {
  const { close } = useOpen()
  const { creations } = useCreations()
  const recentCreations = isRecent ? creations.slice(0, 20) : creations
  const { search, setSearch } = useSearch()
  const q = search.replace(/^@(\s+)?/, '') || ''
  const paletteDrawer = usePaletteDrawer()

  const filteredItems = useMemo(() => {
    if (!q) return recentCreations
    const items = recentCreations.filter(({ title = '' }) => {
      return title?.toLowerCase().includes(q.toLowerCase())
    })

    return items
  }, [recentCreations, q])

  if (!filteredItems.length) {
    return (
      <div className="flex h-16 items-center justify-center text-sm">
        No results found.
      </div>
    )
  }

  return (
    <>
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

                store.panels.updateMainPanel({
                  type: PanelType.CREATION,
                  creationId: item.id,
                })
              }}
            >
              <File size={16} />
              {item.title || 'Untitled'}
            </CommandItem>
          )
        })}
      </CommandGroup>
    </>
  )
}

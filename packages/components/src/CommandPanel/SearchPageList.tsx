import { Dispatch, SetStateAction, useMemo } from 'react'
import { File } from 'lucide-react'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { useCreations } from '@penx/hooks/useCreations'
import { usePages } from '@penx/hooks/usePages'
import { usePaletteDrawer } from '@penx/hooks/usePaletteDrawer'
import { useRouter } from '@penx/libs/i18n'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { CommandGroup, CommandItem } from './command-components'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'

interface Props {
  heading?: string
  isRecent?: boolean
}

export function SearchPageList({ heading = '', isRecent = false }: Props) {
  const { close } = useOpen()
  const creations = useAreaCreationsContext()
  const pages = isRecent ? creations.slice(0, 20) : creations
  const { search, setSearch } = useSearch()
  const q = search.replace(/^@(\s+)?/, '') || ''
  const paletteDrawer = usePaletteDrawer()
  const { push } = useRouter()

  const filteredItems = useMemo(() => {
    if (!q) return pages
    const items = pages.filter(({ title = '' }) => {
      return title?.toLowerCase().includes(q.toLowerCase())
    })

    return items
  }, [pages, q])

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
                push(`/~/page?id=${item.id}`)
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

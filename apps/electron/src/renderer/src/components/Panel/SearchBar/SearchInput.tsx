import { KeyboardEventHandler, memo, useEffect, useRef } from 'react'
import { appEmitter } from '@penx/emitter'
import { cn } from '@penx/utils'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useCommands, useItems } from '~/hooks/useItems'
import { useNavigation } from '~/hooks/useNavigation'
import { useSearch } from '~/hooks/useSearch'
import { openCommand } from '~/lib/openCommand'
import { CommandInput } from '../CommandComponents'

interface SearchInputProps {
  className?: string
  placeholder?: string
  search: string
  searchBarHeight: number
  onValueChange: (search: string) => void
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}

const SearchInputMemo = memo(
  function SearchInput({
    search,
    searchBarHeight,
    onValueChange,
    onKeyDown,
    className,
    placeholder,
  }: SearchInputProps) {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const handleFocus = () => {
        ref.current?.focus()
      }
      appEmitter.on('FOCUS_SEARCH_BAR_INPUT', handleFocus)
      return () => {
        appEmitter.off('FOCUS_SEARCH_BAR_INPUT', handleFocus)
      }
    }, [])

    return (
      <CommandInput
        ref={ref as any}
        className={cn(
          'no-drag placeholder:text-foreground/30 flex w-full flex-1 select-none items-center bg-transparent px-3 text-base outline-none dark:caret-white',
          className,
        )}
        id="searchBarInput"
        style={{
          height: searchBarHeight,
        }}
        placeholder={placeholder || 'Search something...'}
        autoFocus
        value={search}
        onValueChange={onValueChange}
        onKeyDown={onKeyDown}
      />
    )
  },
  (prev, next) => {
    return (
      prev.searchBarHeight === next.searchBarHeight &&
      prev.search === next.search
    )
  },
)

interface Props {
  searchBarHeight: number
  placeholder?: string
}

export const SearchInput = ({ searchBarHeight, placeholder }: Props) => {
  const { search, setSearch } = useSearch()
  const { items, setItems } = useItems()
  const { commands } = useCommands()
  const handleSelect = useHandleSelect()
  const { pop, navigation } = useNavigation()

  return (
    <SearchInputMemo
      search={search}
      className={cn(!search && 'w-20')}
      searchBarHeight={searchBarHeight * 0.6}
      placeholder={placeholder}
      onValueChange={(v) => {
        appEmitter.emit('ON_COMMAND_PALETTE_SEARCH_CHANGE', v)

        // trigger alias
        if (/^\S+\s$/.test(v)) {
          const alias = v.trim()
          const find = items.find((item) => item.data.alias === alias)
          if (find) {
            handleSelect(find)
            setSearch('')
            return
          }
        }

        setSearch(v)
        if (v === '') {
          setItems(commands)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' || e.key === 'delete') {
          if (!search) {
            // if (isCommandAppDetail) {
            //   backToCommandApp()
            // } else {
            //   backToRoot()
            // }
            navigation.length > 1 && pop()
          }
        }

        if (e.key === 'Tab') {
          e.preventDefault()
          if (navigation.length === 1) {
            openCommand({
              id: 'ai-chat',
            })
          }
        }

        if (e.key === 'Enter') {
          // const [a, b = ''] = splitStringByFirstSpace(q)
          // const item = commands.find((item) => item.title === a)
          // if (item) {
          //   handleSelect(item, String(b))
          // }
        }
      }}
    />
  )
}

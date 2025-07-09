import { KeyboardEventHandler, memo, useEffect, useRef } from 'react'
import { Command } from 'cmdk'
import { appEmitter } from '@penx/emitter'
import { StyledCommandInput } from '../CommandComponents'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  search: string
  searchBarHeight: number
  onValueChange: (search: string) => void
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}
export const SearchInput = memo(
  function SearchInput({ search, searchBarHeight, onValueChange, onKeyDown, className }: Props) {
    const ref = useRef<HTMLInputElement>(null)

    console.log('======className:', className)

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
      <StyledCommandInput
        ref={ref as any}
        className={cn(
          'no-drag flex-1 select-none flex items-center bg-transparent w-full placeholder:text-foreground/30',
          className
        )}
        id="searchBarInput"
        h={searchBarHeight}
        px3
        textBase
        outlineNone
        css={{
          'caretColor--dark': 'white'
        }}
        placeholder="Search something..."
        autoFocus
        value={search}
        onValueChange={onValueChange}
        onKeyDown={onKeyDown}
      />
    )
  },
  (prev, next) => {
    return prev.searchBarHeight === next.searchBarHeight && prev.search === next.search
  }
)

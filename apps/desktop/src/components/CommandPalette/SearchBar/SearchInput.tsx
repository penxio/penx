import { KeyboardEventHandler, memo, useEffect, useRef } from 'react'
import { appEmitter } from '@penx/event'
import { StyledCommandInput } from '../CommandComponents'

interface Props {
  search: string
  searchBarHeight: number
  onValueChange: (search: string) => void
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}
export const SearchInput = memo(
  function SearchInput({ search, searchBarHeight, onValueChange, onKeyDown }: Props) {
    const ref = useRef<HTMLInputElement>()

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
        id="searchBarInput"
        className="searchBarInput"
        flex-1
        selectNone
        toCenterY
        bgTransparent
        w-100p
        h={searchBarHeight}
        px3
        placeholderZinc500
        textBase
        outlineNone
        neutral900
        css={{
          'caretColor--dark': 'white',
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
  },
)

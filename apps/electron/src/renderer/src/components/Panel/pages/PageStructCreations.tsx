import { Box } from '@fower/react'
import { Struct } from '@penx/domain'
import { PopButton } from '~/components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { DatabaseName } from '../../DatabaseName'
import { DatabaseApp } from '../CommandApp/DatabaseApp/DatabaseApp'
import { CommandList } from '../CommandComponents'
import { FilterPopover } from '../FilterPopover'
import { ActionPopover } from '../SearchBar/ActionPopover'
import { AddRowButton } from '../SearchBar/AddRowButton'
import { SearchBar } from '../SearchBar/SearchBar'
import { SearchInput } from '../SearchBar/SearchInput'

const searchBarHeight = 54
const footerHeight = 44

export function PageStructCreations() {
  const { currentCommand } = useCurrentCommand()
  const { struct } = useCurrentStruct()
  return (
    <>
      <div
        className="drag border-foreground/10 flex items-center justify-between border-b pr-3 gap-1"
        style={{
          height: searchBarHeight,
        }}
      >
        <PopButton className="-mr-2 ml-3" />
        <SearchInput searchBarHeight={searchBarHeight} />

        {new Struct(struct).isTask && <FilterPopover />}
        <AddRowButton struct={new Struct(struct)} />
      </div>

      <div
        className="relative flex-1 overflow-auto"
        // h={bodyHeight}
        style={{
          overscrollBehavior: 'contain',
          scrollPaddingBlockEnd: 40,
        }}
      >
        <CommandList className="outline-none">
          <DatabaseApp />
        </CommandList>
      </div>
      <Box
        className="border-foreground/10 bg-foreground/5 border-t"
        h={footerHeight}
        toCenterY
        px3
        toBetween
      >
        <Box toCenterY gap1>
          <DatabaseName />
        </Box>
        <ActionPopover />
      </Box>
    </>
  )
}

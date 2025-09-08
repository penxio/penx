import { Box } from '@fower/react'
import { Struct } from '@penx/domain'
import { PopButton } from '../../../components/ExtensionApp/widgets/PopButton'
import { useCurrentCommand } from '../../../hooks/useCurrentCommand'
import { useCurrentStruct } from '../../../hooks/useCurrentStruct'
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
  const { struct } = useCurrentStruct()
  return (
    <>
      <div
        className="drag border-foreground/10 flex items-center justify-between gap-1 border-b pr-3"
        style={{
          height: searchBarHeight,
        }}
      >
        <PopButton className="-mr-2 ml-3" />
        <SearchInput searchBarHeight={searchBarHeight} />

        {new Struct(struct).isTask && <FilterPopover />}
        <AddRowButton struct={new Struct(struct)} />
      </div>

      <div className="relative flex-1">
        <CommandList className="outline-none">
          <DatabaseApp />
        </CommandList>
      </div>
      <div
        className="border-foreground/10 bg-foreground/5 flex items-center justify-between border-t px-3"
        style={{
          height: footerHeight,
        }}
      >
        <div className="flex items-center gap-1">
          <DatabaseName />
        </div>
        <ActionPopover />
      </div>
    </>
  )
}

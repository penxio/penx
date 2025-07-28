import { Conf } from 'electron-conf/renderer'
import { Struct } from '@penx/domain'
import { cn } from '@penx/utils'
import { PopButton } from '~/components/ExtensionApp/widgets/PopButton'
import { PinnedButton } from '~/components/PinnedButton'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useNavigation } from '~/hooks/useNavigation'
import { useSearch } from '~/hooks/useSearch'
import { AddRowButton } from './AddRowButton'
import { SearchInput } from './SearchInput'

interface Props {
  searchBarHeight: number
}
export const SearchBar = ({ searchBarHeight }: Props) => {
  const { search } = useSearch()
  const { current, isRoot } = useNavigation()

  if (isRoot) {
    return (
      <>
        <SearchInput searchBarHeight={searchBarHeight} />
        {!search && <div className="h-full flex-1"></div>}
        <PinnedButton />
      </>
    )
  }

  if (current.path === '/edit-creation') {
    return (
      <>
        <PopButton className="-mr-2 ml-3" />
        {!search && <div className="h-full flex-1"></div>}
      </>
    )
  }

  if (current.path === '/edit-struct') {
    return (
      <>
        <PopButton className="-mr-2 ml-3" />
        {!search && <div className="h-full flex-1"></div>}
      </>
    )
  }

  return (
    <>
      <PopButton className="-mr-2 ml-3" />
      {!search && <div className="h-full flex-1"></div>}

      {/* {isCommandApp && currentCommand?.data?.filters && (
        <SearchBarFilter filters={currentCommand?.data?.filters} />
      )} */}

      {/* {loading && <hr command-palette-loader="" />} */}
    </>
  )
}

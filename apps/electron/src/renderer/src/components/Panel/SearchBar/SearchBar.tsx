import { useQuery } from '@tanstack/react-query'
import { Conf } from 'electron-conf/renderer'
import { PinIcon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { cn } from '@penx/utils'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useCommands, useItems } from '~/hooks/useItems'
import { useLoading } from '~/hooks/useLoading'
import { useNavigation } from '~/hooks/useNavigation'
import { useSearch } from '~/hooks/useSearch'
import { AddRowButton } from './AddRowButton'
import { BackRootButton } from './BackRootButton'
import { DatabaseName } from './DatabaseName'
import { SearchBarFilter } from './SearchBarFilter'
import { SearchInput } from './SearchInput'

const conf = new Conf()

interface Props {
  searchBarHeight: number
}
export const SearchBar = ({ searchBarHeight }: Props) => {
  const { search, setSearch } = useSearch()
  const { items, setItems } = useItems()
  const { commands } = useCommands()
  const { loading } = useLoading()
  const handleSelect = useHandleSelect()
  const { currentCommand } = useCurrentCommand()
  const { struct } = useCurrentStruct()

  const { data: pinned, refetch } = useQuery({
    queryKey: ['input-window-pinned'],
    queryFn: async () => {
      const pinned = await conf.get('pinned')
      return !!pinned
    },
  })
  async function pinWindow() {
    await conf.set('pinned', !pinned)
    window.electron.ipcRenderer.send('pinned', !pinned)
    refetch()
  }

  const currentCommandName = currentCommand?.data?.commandName

  const isCreationDetail = !!currentCommand?.data?.struct

  const isDatabaseApp = currentCommand?.data?.type === 'Struct'
  const { current, isRoot } = useNavigation()
  const searchInput = (
    <SearchInput
      search={search}
      className={cn(!search && 'w-20')}
      searchBarHeight={searchBarHeight * 0.6}
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
          // if (!search && isCommandApp) {
          //   if (isCommandAppDetail) {
          //     backToCommandApp()
          //   } else {
          //     backToRoot()
          //   }
          // }
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
  if (isRoot) {
    return (
      <>
        {searchInput}
        {!search && <div className="h-full flex-1"></div>}
        <PinIcon
          className={cn(
            'no-drag size-4 cursor-pointer',
            pinned && 'text-brand',
          )}
          onClick={() => {
            pinWindow()
          }}
        />
      </>
    )
  }

  if (current.path === '/struct-creations') {
    return (
      <>
        <BackRootButton className="-mr-2 ml-3" />
        <DatabaseName />
        {searchInput}
        {!search && <div className="h-full flex-1"></div>}
        <AddRowButton struct={new Struct(struct)} />
      </>
    )
  }

  if (current.path === '/edit-creation') {
    return (
      <>
        <BackRootButton className="-mr-2 ml-3" />
        <DatabaseName />
        {!search && <div className="h-full flex-1"></div>}
      </>
    )
  }

  if (current.path === '/edit-struct') {
    return (
      <>
        <BackRootButton className="-mr-2 ml-3" />
        <DatabaseName />
        {!search && <div className="h-full flex-1"></div>}
      </>
    )
  }

  return (
    <>
      <BackRootButton className="-mr-2 ml-3" />
      {isDatabaseApp && !isCreationDetail && <DatabaseName />}
      {isDatabaseApp && !isCreationDetail && (
        <AddRowButton struct={new Struct(struct)} />
      )}

      {!search && <div className="h-full flex-1"></div>}

      {/* {isCommandApp && currentCommand?.data?.filters && (
        <SearchBarFilter filters={currentCommand?.data?.filters} />
      )} */}

      {/* {loading && <hr command-palette-loader="" />} */}
    </>
  )
}

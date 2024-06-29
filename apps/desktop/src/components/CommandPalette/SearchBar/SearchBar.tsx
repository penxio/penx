import { Box } from '@fower/react'
import { appEmitter } from '@penx/event'
import { ConnectWallet } from '~/ConnectWallet'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCommands, useItems } from '~/hooks/useItems'
import { useSearch } from '~/hooks/useSearch'
import { CommandService } from '~/services/CommandService'
import { AddRowButton } from './AddRowButton'
import { BackRootButton } from './BackRootButton'
import { CommandAppLoading } from './CommandAppLoading'
import { DatabaseName } from './DatabaseName'
import { SearchBarFilter } from './SearchBarFilter'
import { SearchInput } from './SearchInput'

interface Props {
  searchBarHeight: number
}
export const SearchBar = ({ searchBarHeight }: Props) => {
  const { search, setSearch } = useSearch()
  const { items, setItems } = useItems()
  const { commands } = useCommands()
  const { isCommandApp, isCommandAppDetail, backToRoot, backToCommandApp } = useCommandPosition()
  const { currentCommand } = useCurrentCommand()

  const currentCommandName = currentCommand?.name
  const isMarketplaceDetail = currentCommandName === 'marketplace' && isCommandAppDetail

  const isDatabaseApp = currentCommand?.isDatabase

  return (
    <Box
      data-tauri-drag-region
      toCenterY
      borderBottom
      borderNeutral200
      relative
      h={searchBarHeight}
      mr2
    >
      {isCommandApp && <BackRootButton pl3 mr--8 />}

      {isDatabaseApp && <DatabaseName />}
      {isDatabaseApp && <AddRowButton />}

      {!isMarketplaceDetail && (
        <SearchInput
          search={search}
          searchBarHeight={searchBarHeight}
          onValueChange={(v) => {
            appEmitter.emit('ON_COMMAND_PALETTE_SEARCH_CHANGE', v)

            // trigger alias
            if (/^\S+\s$/.test(v)) {
              const alias = v.trim()
              const find = items.find((item) => item.alias === alias)
              if (find) {
                const commandService = new CommandService(find)
                commandService.handleSelect()
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
              if (!search && isCommandApp) {
                if (isCommandAppDetail) {
                  backToCommandApp()
                } else {
                  backToRoot()
                }
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
      )}
      {isCommandApp && currentCommand?.filters && (
        <SearchBarFilter filters={currentCommand?.filters} />
      )}
      <ConnectWallet></ConnectWallet>

      <CommandAppLoading />
    </Box>
  )
}

import { ReactNode, useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { useActionPopover } from '~/hooks/useActionPopover'
import { useCommandAppLoading } from '~/hooks/useCommandAppLoading'
import { commandUIAtom, useCommandAppUI } from '~/hooks/useCommandAppUI'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems, useQueryCommands } from '~/hooks/useItems'
import { useNavigations } from '~/hooks/useNavigations'
import { useReset } from '~/hooks/useReset'
import { useSearch } from '~/hooks/useSearch'
import { useValue } from '~/hooks/useValue'
import { handleEscape } from '~/lib/handleEscape'
import { ICommandItem } from '~/lib/types'
import { CommandApp } from './CommandApp/CommandApp'
import { Command, CommandList } from './CommandComponents'
import { CommandPaletteFooter } from './CommandPaletteFooter'
import { ListItemUI } from './ListItemUI'
import { PageEditCreation } from './pages/PageEditCreation'
import { PageEditStruct } from './pages/PageEditStruct'
import { PageRoot } from './pages/PageRoot'
import { PageStructCreations } from './pages/PageStructCreations'
import { BackRootButton } from './SearchBar/BackRootButton'
import { SearchBar } from './SearchBar/SearchBar'

const windowHeight = 470
const searchBarHeight = 54
const footerHeight = 48

function init() {
  handleEscape()
  window.electron.ipcRenderer.on('panel-window-show', () => {
    appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
  })
}

init()

export const CommandPalette = () => {
  const { value, setValue } = useValue()

  // console.log('========items:', items)

  // console.log(
  //   '=========developingItems, commandItems:',
  //   developingItems,
  //   commandItems,
  // )

  const { currentCommand } = useCurrentCommand()
  const { ui } = useCommandAppUI()
  const { loading } = useCommandAppLoading()

  useQueryCommands()

  useReset(setValue)
  const isIframe = currentCommand?.data?.runtime === 'iframe'

  const bodyHeight = isIframe
    ? windowHeight
    : windowHeight - searchBarHeight - footerHeight

  const { current } = useNavigations()

  const header = useMemo(() => {
    return (
      <div
        className="drag border-foreground/10 flex items-center border-b"
        style={{
          height: searchBarHeight,
        }}
      >
        <SearchBar searchBarHeight={searchBarHeight} />
      </div>
    )
  }, [current])

  const body = useMemo(() => {
    if (current.path === '/root') {
      return <PageRoot />
    }

    if (current.path === '/edit-struct') {
      return <PageEditStruct />
    }

    if (current.path === '/struct-creations') {
      return <PageStructCreations />
    }

    if (current.path === '/edit-creation') {
      return <PageEditCreation />
    }

    return current.component?.()
  }, [current])

  const footer = useMemo(() => {
    return <CommandPaletteFooter />
  }, [current])

  return (
    <Command
      id="command-palette"
      label="Command Menu"
      className="command-panel text-foreground/80 bg-background/80 absolute bottom-0 left-0 right-0 top-0 z-10 flex w-full flex-col dark:bg-neutral-900/80"
      // loop
      value={value}
      onValueChange={(v) => {
        setValue(v)
      }}
      // shouldFilter={false}
      filter={(value, search) => {
        // console.log('value:', value, 'search:', search)
        return 1
      }}
    >
      {header}

      <div
        className="relative flex-1 overflow-auto"
        // h={bodyHeight}
        style={{
          overscrollBehavior: 'contain',
          scrollPaddingBlockEnd: 40,
        }}
      >
        {body}
      </div>
      {footer}
    </Command>
  )
}

import { ReactNode, useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { isDesktop } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { useCommandAppLoading } from '../../hooks/useCommandAppLoading'
import { commandUIAtom, useCommandAppUI } from '../../hooks/useCommandAppUI'
import { useCurrentCommand } from '../../hooks/useCurrentCommand'
import { useItems, useQueryCommands } from '../../hooks/useItems'
import { useQueryNavigations } from '../../hooks/useNavigation'
import { useValue } from '../../hooks/useValue'
import { handleEscape } from '../../lib/handleEscape'
import { ICommandItem } from '../../lib/types'
import { Command, CommandList } from './CommandComponents'
import { CommandPaletteFooter } from './CommandPaletteFooter'
import { PageAICommand } from './pages/PageAICommand'
import { PageConfigureShortcut } from './pages/PageConfigureShortcut'
import { PageEditCreation } from './pages/PageEditCreation'
import { PageEditStruct } from './pages/PageEditStruct'
import { PageQuickInput } from './pages/PageQuickInput'
import { PageRoot } from './pages/PageRoot'
import { PageStructCreations } from './pages/PageStructCreations'
import { BackRootButton } from './SearchBar/BackRootButton'
import { SearchBar } from './SearchBar/SearchBar'

const windowHeight = 470
const searchBarHeight = 54
const footerHeight = 48

function init() {
  handleEscape()
  if (isDesktop) {
    window.electron.ipcRenderer.on('panel-window-show', () => {
      appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
    })

    window.electron.ipcRenderer.on('focus-search-input', () => {
      console.log('focus-search-input')
      setTimeout(() => {
        appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      }, 1000)
    })
  }
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

  const { current, isLoading } = useQueryNavigations()

  const isIframe = currentCommand?.data?.runtime === 'iframe'

  const header = useMemo(() => {
    return (
      <div
        className="drag border-foreground/10 flex items-center justify-between border-b pr-3"
        style={{
          height: searchBarHeight,
        }}
      >
        <SearchBar searchBarHeight={searchBarHeight} />
      </div>
    )
  }, [current])

  const body = useMemo(() => {
    if (!current) return null
    if (current.path === '/root') {
      return <PageRoot />
    }

    if (current.path === '/configure-shortcut') {
      return <PageConfigureShortcut />
    }

    return current.component?.()
  }, [current])

  const footer = useMemo(() => {
    return <CommandPaletteFooter />
  }, [current])

  const ExtensionComponent = currentCommand?.data?.component!
  const isExtension = current?.path === '/extension'

  const content = useMemo(() => {
    if (!current) return null
    if (isExtension) {
      if (!currentCommand) return null

      return <ExtensionComponent />
    }

    if (current.path === '/configure-shortcut') {
      return <PageConfigureShortcut />
    }

    if (current.path === '/struct-creations') {
      return <PageStructCreations />
    }

    if (current.path === '/ai-command') {
      return <PageAICommand />
    }

    if (current.path === '/edit-struct') {
      return <PageEditStruct />
    }

    return (
      <>
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
      </>
    )
  }, [isExtension, header, body, footer])

  if (isLoading) return null

  if (current.path === '/edit-creation') {
    return <PageEditCreation />
  }

  return (
    <Command
      id="command-palette"
      label="Command Menu"
      className="command-panel text-foreground/80 absolute bottom-0 left-0 right-0 top-0 z-10 flex w-full flex-col bg-white/70 dark:bg-neutral-900/80"
      // loop={false}
      value={value}
      onValueChange={(v) => {
        // console.log('============v:', v)
        setValue(v)
      }}
      // shouldFilter={false}
      filter={(value, search) => {
        // console.log('value:', value, 'search:', search)
        return 1
      }}
    >
      {content}
    </Command>
  )
}

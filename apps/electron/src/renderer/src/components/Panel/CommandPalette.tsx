import { ReactNode, useEffect } from 'react'
import { Box } from '@fower/react'
import { Command } from 'cmdk'
import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'
import { useCommandAppLoading } from '~/hooks/useCommandAppLoading'
import { commandUIAtom, useCommandAppUI } from '~/hooks/useCommandAppUI'
import { positionAtom, useCommandPosition } from '~/hooks/useCommandPosition'
import {
  currentCommandAtom,
  useCurrentCommand,
} from '~/hooks/useCurrentCommand'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems, useQueryCommands } from '~/hooks/useItems'
import { useReset } from '~/hooks/useReset'
import { useValue } from '~/hooks/useValue'
import { handleEscape } from '~/lib/handleEscape'
import { ICommandItem } from '~/lib/types'
import { CommandApp } from './CommandApp/CommandApp'
import { StyledCommand, StyledCommandList } from './CommandComponents'
import { CommandPaletteFooter } from './CommandPaletteFooter'
import { ListItemUI } from './ListItemUI'
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

  const { commandItems } = useItems()

  // console.log('========items:', items)

  // console.log(
  //   '=========developingItems, commandItems:',
  //   developingItems,
  //   commandItems,
  // )

  const { isRoot, isCommandApp } = useCommandPosition()
  const { currentCommand } = useCurrentCommand()
  const { ui } = useCommandAppUI()
  const { loading } = useCommandAppLoading()

  const handleSelect = useHandleSelect()

  useQueryCommands()

  useReset(setValue)
  const isIframe = isCommandApp && currentCommand?.data?.runtime === 'iframe'

  const bodyHeight = isIframe
    ? windowHeight
    : windowHeight - searchBarHeight - footerHeight

  return (
    <StyledCommand
      id="command-palette"
      label="Command Menu"
      // className="command-panel bg-neutral-50/90 dark:bg-neutral-950/80"
      className="command-panel text-foreground/80 absolute bottom-0 left-0 right-0 top-0 z-[10000] flex w-full flex-col bg-neutral-50/80 dark:bg-neutral-900/80"
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
      {isIframe && (
        <Box
          absolute
          top0
          left0
          toCenterY
          toRight
          w={searchBarHeight - 16}
          h={searchBarHeight}
          zIndex-10000
        >
          <BackRootButton className="z-[100]" />
        </Box>
      )}
      {!isIframe && <SearchBar searchBarHeight={searchBarHeight} />}
      <div
        className="relative flex-1 overflow-auto"
        // h={bodyHeight}
        style={{
          overscrollBehavior: 'contain',
          scrollPaddingBlockEnd: 40,
        }}
      >
        {isCommandApp &&
          currentCommand &&
          (currentCommand.data.runtime === 'iframe' ? (
            <Box relative h-100p>
              <Box
                as="iframe"
                id="command-app-iframe"
                width="100%"
                height="100%"
                p0
                m0
                absolute
                top0
                zIndex-99
                // src='https://penx.io'
              />
            </Box>
          ) : (
            <StyledCommandList className="p-2 outline-none">
              <CommandApp
                loading={loading}
                ui={ui}
                currentCommand={currentCommand}
              />
            </StyledCommandList>
          ))}
        {isRoot && (
          <StyledCommandList className="p-2">
            <ListGroup
              heading={''}
              items={commandItems}
              onSelect={(item) => handleSelect(item)}
            />
            {/* Support databases in future  */}
            {/* 
            <ListGroup
              heading="Databases"
              items={databaseItems}
              onSelect={(item) => handleSelect(item)}
            /> */}
          </StyledCommandList>
        )}
      </div>
      {!isIframe && <CommandPaletteFooter footerHeight={footerHeight} />}
    </StyledCommand>
  )
}

interface ListGroupProps {
  heading: ReactNode
  items: ICommandItem[]
  onSelect?: (item: ICommandItem) => void
}

function ListGroup({ heading, items, onSelect }: ListGroupProps) {
  return (
    <Command.Group heading={heading}>
      {items.map((item, index) => {
        return (
          <ListItemUI
            key={index}
            index={index}
            value={item.data.commandName}
            item={item}
            onSelect={onSelect}
          />
        )
      })}
    </Command.Group>
  )
}

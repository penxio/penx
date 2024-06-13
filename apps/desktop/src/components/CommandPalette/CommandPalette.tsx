import { useEffect } from 'react'
import { Box } from '@fower/react'
import { Command } from 'cmdk'
import {
  getAllApps,
  refreshApplicationsList,
} from 'tauri-plugin-jarvis-api/commands'
import { isServer } from '@penx/constants'
import { store } from '@penx/store'
import { ICommandItem } from '~/common/types'
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
import { CommandApp } from './CommandApp/CommandApp'
import { StyledCommand, StyledCommandList } from './CommandComponents'
import { CommandPaletteFooter } from './CommandPaletteFooter'
import { ListItemUI } from './ListItemUI'
import { BackRootButton } from './SearchBar/BackRootButton'
import { SearchBar } from './SearchBar/SearchBar'

const windowHeight = 470
const searchBarHeight = 54
const footerHeight = 40

// message from iframe
if (!isServer) {
  window.addEventListener('message', (event) => {
    const position = store.get(positionAtom)
    if (position !== 'ROOT') {
      store.set(positionAtom, 'ROOT')
      store.set(currentCommandAtom, null as any)
      store.set(commandUIAtom, {} as any)
    }
  })
}

export const CommandPalette = () => {
  const { value, setValue } = useValue()

  const { developingItems, commandItems, databaseItems, applicationItems } =
    useItems()

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
      className="command-panel"
      // shadow="0 16px 70px rgba(0,0,0,.2)"
      w={['100%']}
      column
      absolute
      top-0
      left0
      right0
      bottom0
      zIndex-10000
      // bg="#F6F2F0"
      // bgWhite
      style={
        {
          // backdropFilter: 'blur(200px)',
        }
      }
      loop
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
        <BackRootButton
          data-tauri-drag-region
          absolute
          top1
          left1
          zIndex-100
          square8
          roundedXL
          bgNeutral900--T94
          bgNeutral900--T94--hover
        />
      )}
      {!isIframe && <SearchBar searchBarHeight={searchBarHeight} />}
      <Box h={bodyHeight} overflowAuto relative>
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
            <StyledCommandList p2>
              <CommandApp
                loading={loading}
                ui={ui}
                currentCommand={currentCommand}
              />
            </StyledCommandList>
          ))}
        {isRoot && (
          <StyledCommandList p2>
            {developingItems.length > 0 && (
              <Command.Group heading="Development">
                {developingItems.map((item, index) => {
                  return (
                    <ListItemUI
                      key={index}
                      index={index}
                      value={item.data.commandName}
                      item={item}
                      onSelect={(item) => handleSelect(item)}
                    />
                  )
                })}
              </Command.Group>
            )}
            <ListGroup
              heading="Commands"
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

            <ListGroup
              heading="Applications"
              items={applicationItems.splice(0, 10)}
              onSelect={(item) => handleSelect(item)}
            />
          </StyledCommandList>
        )}
      </Box>
      {!isIframe && <CommandPaletteFooter footerHeight={footerHeight} />}
    </StyledCommand>
  )
}

interface ListGroupProps {
  heading: string
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

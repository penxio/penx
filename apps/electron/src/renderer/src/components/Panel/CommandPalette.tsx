import { ReactNode, useEffect } from 'react'
import { Box } from '@fower/react'
import { Command as ShellCmd } from '@tauri-apps/plugin-shell'
import { Command } from 'cmdk'
import { store } from '@penx/store'
import { useCommandAppLoading } from '~/hooks/useCommandAppLoading'
import { commandUIAtom, useCommandAppUI } from '~/hooks/useCommandAppUI'
import { positionAtom, useCommandPosition } from '~/hooks/useCommandPosition'
import { currentCommandAtom, useCurrentCommand } from '~/hooks/useCurrentCommand'
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
import { ICommandItem } from '~/lib/types'
import { handleEscape } from '~/lib/handleEscape'

const windowHeight = 470
const searchBarHeight = 54
const footerHeight = 48

function init() {
  handleEscape()
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

  const bodyHeight = isIframe ? windowHeight : windowHeight - searchBarHeight - footerHeight

  return (
    <StyledCommand
      id="command-palette"
      label="Command Menu"
      // className="command-panel bg-neutral-50/90 dark:bg-neutral-950/80"
      className="command-panel bg-neutral-50/80 dark:bg-neutral-900/80 absolute top-0 left-0 right-0 bottom-0 text-foreground/80 z-[10000] flex flex-col w-full"
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
          data-tauri-drag-region
          absolute
          top0
          left0
          toCenterY
          toRight
          w={searchBarHeight - 16}
          h={searchBarHeight}
          zIndex-10000
        >
          <BackRootButton
            data-tauri-drag-region
            zIndex-100
            square6
            roundedXL
            bgNeutral900--T94
            bgNeutral900--T94--hover
          />
        </Box>
      )}
      {!isIframe && <SearchBar searchBarHeight={searchBarHeight} />}
      <Box
        h={bodyHeight}
        overflowAuto
        relative
        style={{
          overscrollBehavior: 'contain',
          scrollPaddingBlockEnd: 40
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
            <StyledCommandList className="p-2">
              <CommandApp loading={loading} ui={ui} currentCommand={currentCommand} />
            </StyledCommandList>
          ))}
        {isRoot && (
          <StyledCommandList className="p-2">
            <ListGroup heading={''} items={commandItems} onSelect={(item) => handleSelect(item)} />
            {/* Support databases in future  */}
            {/* 
            <ListGroup
              heading="Databases"
              items={databaseItems}
              onSelect={(item) => handleSelect(item)}
            /> */}
          </StyledCommandList>
        )}
      </Box>
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

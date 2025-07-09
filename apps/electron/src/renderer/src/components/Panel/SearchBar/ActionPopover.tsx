import { useEffect, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { DoorOpenIcon, EyeOffIcon, Star } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { appEmitter } from '@penx/emitter'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems } from '~/hooks/useItems'
import { useValue } from '~/hooks/useValue'
import {
  StyledCommand,
  StyledCommandGroup,
  StyledCommandInput,
  StyledCommandItem,
  StyledCommandList
} from './../CommandComponents'
import { Kbd } from '@penx/components/Kbd'

function useOnCmdK(fn: () => void) {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        fn()
      }
    }

    document.addEventListener('keydown', listener)

    return () => {
      document.removeEventListener('keydown', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

interface Props {}

export const ActionPopover = ({}: Props) => {
  const { currentCommand } = useCurrentCommand()
  const [open, setOpen] = useState(false)
  const { value } = useValue()
  const { items } = useItems()
  const { isRoot } = useCommandPosition()

  const selectItem = items.find((item) => item.data.commandName === value)

  useOnCmdK(() => {
    setOpen((o) => {
      if (o) appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      return !o
    })
  })

  const handleSelect = useHandleSelect()

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
          appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
        }
      }}
    >
      <PopoverTrigger asChild>
        <Box
          className="no-drag"
          textSM
          cursorPointer
          neutral600
          bgNeutral200--T60={open}
          py-4
          pr-4
          pl2
          rounded-6
          toCenterY
          gap2
          onClick={() => {
            setOpen((o) => !o)
          }}
        >
          <Box>Actions</Box>
          <Box toCenterY gap1>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent className="action-menu shadow-popover p-0" align="end" sideOffset={20}>
        <StyledCommand className="w-full p-0">
          <StyledCommandList
            className="pt-0 px-2 pb-2 overflow-auto"
            style={{
              overscrollBehavior: 'contain',
              transition: '100ms ease',
              transitionProperty: 'height'
            }}
          >
            <StyledCommandGroup
              heading={
                currentCommand?.data?.commandName || (selectItem?.title as string) || 'Actions'
              }
            >
              {isRoot && (
                <>
                  <MenuItem
                    shortcut="↵"
                    onSelect={() => {
                      selectItem && handleSelect(selectItem)
                      setOpen(false)
                    }}
                  >
                    <Box toCenterY gap2 inlineFlex>
                      <Box gray800>
                        <DoorOpenIcon size={16} />
                      </Box>
                      <Box>Open Command</Box>
                    </Box>
                  </MenuItem>
                  {/* <MenuItem shortcut="⌘ ↵">Show in Finder</MenuItem> */}
                  <MenuItem shortcut="⌘ ⇧ F">
                    <Box toCenterY gap2 inlineFlex>
                      <Box gray800>
                        <Star size={16} />
                      </Box>
                      <Box>Add to Favorites</Box>
                    </Box>
                  </MenuItem>

                  <MenuItem shortcut="">
                    <Box toCenterY gap2>
                      <Box gray800 inlineFlex>
                        <EyeOffIcon size={16} />
                      </Box>
                      <Box>Disable Command</Box>
                    </Box>
                  </MenuItem>
                </>
              )}
            </StyledCommandGroup>
          </StyledCommandList>
          <StyledCommandInput placeholder="Search for actions..." />
        </StyledCommand>
      </PopoverContent>
    </Popover>
  )
}

interface MenuItemProps extends Omit<FowerHTMLProps<'div'>, 'onSelect'> {
  shortcut: string
  onSelect?: () => void
}
function MenuItem({ children, shortcut, onSelect, ...rest }: MenuItemProps) {
  return (
    <StyledCommandItem
      className="flex h-10 cursor-pointer text-sm rounded-md gap-2 px-2 items-center transition-normal data-[selected='true']:bg-foreground/10"
      onSelect={() => {
        onSelect?.()
      }}
      onClick={() => {
        onSelect?.()
      }}
      css={{
        "&[aria-selected='true']": {
          bgNeutral100: true
        },

        "&[aria-disabled='true']": {
          cursorNotAllowed: true
        }
      }}
      {...rest}
    >
      {children}
      <Box toBetween toCenterY ml-auto gap1>
        {shortcut.split(' ').map((key) => {
          return <Kbd key={key}>{key}</Kbd>
        })}
      </Box>
    </StyledCommandItem>
  )
}

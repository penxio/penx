import { useEffect, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import {
  BracesIcon,
  DoorOpenIcon,
  EditIcon,
  EyeOffIcon,
  ShareIcon,
  Star,
  Trash2Icon,
  TrashIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Kbd } from '@penx/components/Kbd'
import { appEmitter } from '@penx/emitter'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { useActionPopover } from '~/hooks/useActionPopover'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems } from '~/hooks/useItems'
import { useValue } from '~/hooks/useValue'
import { ICommandItem } from '~/lib/types'
import {
  StyledCommand,
  StyledCommandGroup,
  StyledCommandInput,
  StyledCommandItem,
  StyledCommandList,
} from './../CommandComponents'

function useOnCmdK(fn: () => void, open: boolean) {
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
  }, [open])
}

interface Props {}

export const ActionPopover = ({}: Props) => {
  const { currentCommand } = useCurrentCommand()
  const { open, setOpen } = useActionPopover()
  const { value } = useValue()
  const { items } = useItems()
  const { isRoot, isCommandApp } = useCommandPosition()

  const selectItem = items.find((item) => {
    return item.data?.struct?.id === value || item.data.commandName === value
  })

  useOnCmdK(() => {
    setTimeout(() => {
      if (!open) appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      setOpen(!open)
    }, 0)
  }, open)

  const handleSelect = useHandleSelect()

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        console.log('======v:', open)
        setOpen(v)
        if (!v) {
          appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
        }
      }}
    >
      <PopoverTrigger asChild>
        <div
          className={cn(
            'no-drag text-foreground/60 flex cursor-pointer items-center gap-2 rounded-md py-1 pl-3 pr-1 text-sm',
            open && 'bg-foreground/10',
          )}
          // onClick={() => {
          //   setOpen((o) => !o)
          // }}
        >
          <div>
            <Trans>Actions</Trans>
          </div>
          <Box toCenterY gap1>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </Box>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="action-menu p-0"
        align="end"
        sideOffset={20}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
          }
        }}
      >
        <StyledCommand className="w-full p-0">
          <StyledCommandList
            className="overflow-auto px-2 pb-2 pt-0"
            style={{
              overscrollBehavior: 'contain',
              transition: '100ms ease',
              transitionProperty: 'height',
            }}
          >
            <StyledCommandGroup
              heading={
                currentCommand?.data?.commandName ||
                (selectItem?.title as string) ||
                'Actions'
              }
            >
              {!!currentCommand?.data?.struct && (
                <StructActions
                  close={() => setOpen(false)}
                  onOpenCommand={() => {
                    selectItem && handleSelect(selectItem)
                    setOpen(false)
                  }}
                />
              )}

              {isRoot && (
                <RootActions
                  command={selectItem!}
                  close={() => setOpen(false)}
                />
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
function MenuItem({
  children,
  shortcut,
  onSelect,
  className,
  ...rest
}: MenuItemProps) {
  return (
    <StyledCommandItem
      className={cn(
        "transition-normal data-[selected='true']:bg-foreground/10 text-foreground/80 flex h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm",
        className,
      )}
      onSelect={() => {
        onSelect?.()
      }}
      onClick={() => {
        onSelect?.()
      }}
      css={{
        "&[aria-selected='true']": {
          bgNeutral100: true,
        },

        "&[aria-disabled='true']": {
          cursorNotAllowed: true,
        },
      }}
      {...rest}
    >
      {children}
      <Box toBetween toCenterY ml-auto gap1>
        {shortcut &&
          shortcut.split(' ').map((key) => {
            return <Kbd key={key}>{key}</Kbd>
          })}
      </Box>
    </StyledCommandItem>
  )
}

interface RootActionsProps {
  close: () => void
  command: ICommandItem
}
function RootActions({ command, close }: RootActionsProps) {
  const { value } = useValue()
  const { structs } = useStructs()
  const struct = structs.find((s) => s.id === value)
  const handleSelect = useHandleSelect()

  return (
    <>
      <MenuItem
        shortcut="↵"
        onSelect={() => {
          command && handleSelect(command)
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div className="">
            <DoorOpenIcon size={16} />
          </div>
          <div>
            <Trans>Open Command</Trans>
          </div>
        </Box>
      </MenuItem>
      {!!struct && (
        <MenuItem
          shortcut=""
          onSelect={() => {
            command && handleSelect(command, { isEditStructProp: true })
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <div className="">
              <BracesIcon size={16} />
            </div>
            <div>
              <Trans>Edit Properties</Trans>
            </div>
          </Box>
        </MenuItem>
      )}
      {/* <MenuItem shortcut="">
        <Box toCenterY gap2 inlineFlex>
          <div>
            <Star size={16} />
          </div>
          <div>
            <Trans>Add to Favorites</Trans>
          </div>
        </Box>
      </MenuItem> */}
    </>
  )
}

interface StructActionsProps {
  onOpenCommand: () => void
  close: () => void
}

function StructActions({ onOpenCommand, close }: StructActionsProps) {
  const { setPosition } = useCommandPosition()
  const { value } = useValue()
  return (
    <>
      <MenuItem
        shortcut=""
        onSelect={() => {
          setPosition('COMMAND_APP_DETAIL')
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div className="">
            <EditIcon size={16} />
          </div>
          <div>
            <Trans>Edit content</Trans>
          </div>
        </Box>
      </MenuItem>
      <MenuItem
        shortcut=""
        onSelect={() => {
          toast.info('Coming soon~')
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div>
            <ShareIcon size={16} />
          </div>
          <div>
            <Trans>Share</Trans>
          </div>
        </Box>
      </MenuItem>
      <MenuItem
        shortcut=""
        className="text-red-500"
        onSelect={() => {
          const creations = store.creations.get()
          const creation = creations.find((c) => c.id === value)!
          store.creations.deleteCreation(creation)
          close()
          setTimeout(() => {
            appEmitter.emit('DELETE_CREATION_SUCCESS', creation.id)
          }, 0)
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div>
            <Trash2Icon size={16} />
          </div>
          <div>
            <Trans>Delete record</Trans>
          </div>
        </Box>
      </MenuItem>
    </>
  )
}

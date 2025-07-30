import { useEffect, useMemo, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import {
  BracesIcon,
  DoorOpenIcon,
  EditIcon,
  EyeOffIcon,
  KeyboardIcon,
  MoveDownIcon,
  MoveUp,
  ShareIcon,
  Star,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
  TrashIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Kbd } from '@penx/components/Kbd'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { useActionPopover } from '~/hooks/useActionPopover'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems } from '~/hooks/useItems'
import { useNavigation } from '~/hooks/useNavigation'
import { useSelectStruct } from '~/hooks/useSelectStruct'
import { useValue } from '~/hooks/useValue'
import { ICommandItem } from '~/lib/types'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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

  const selectItem = items.find((item) => {
    return item.data?.struct?.id === value || item.data.commandName === value
  })

  useOnCmdK(() => {
    setTimeout(() => {
      if (!open) appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      setOpen(!open)
    }, 0)
  }, open)

  const { current } = useNavigation()

  const actionList = useMemo(() => {
    if (current.path === '/root') {
      return <RootActions command={selectItem!} close={() => setOpen(false)} />
    }

    if (current.path === '/struct-creations') {
      return <StructActions close={() => setOpen(false)} />
    }
    return null
  }, [current, selectItem])

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
      {open && (
        <div
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => setOpen(false)}
        />
      )}
      <PopoverContent
        className="action-menu z-50 p-0"
        align="end"
        sideOffset={20}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
          }
        }}
      >
        <Command className="w-full p-0">
          <CommandList
            className="overflow-auto px-2 pb-2 pt-0"
            style={{
              overscrollBehavior: 'contain',
              transition: '100ms ease',
              transitionProperty: 'height',
            }}
          >
            <CommandGroup
              heading={
                currentCommand?.data?.commandName ||
                (selectItem?.title as string) ||
                'Actions'
              }
            >
              {actionList}
            </CommandGroup>
          </CommandList>
          <CommandInput
            className="border-foreground/10 border-t px-3 py-3"
            placeholder={t`Search for actions...`}
          />
        </Command>
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
    <CommandItem
      className={cn(
        "transition-normal data-[selected='true']:bg-foreground/10 text-foreground/80 flex h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm",
        className,
      )}
      onSelect={() => {
        onSelect?.()
        appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      }}
      onClick={() => {
        onSelect?.()
        appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
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
    </CommandItem>
  )
}

interface RootActionsProps {
  close: () => void
  command: ICommandItem
}
function RootActions({ command, close }: RootActionsProps) {
  const { value } = useValue()
  const { structs } = useStructs()
  const { items } = useItems()
  const struct = structs.find((s) => s.id === value)
  console.log('=========struct:', struct)

  const handleSelect = useHandleSelect()
  const selectStruct = useSelectStruct()
  const { push, reset } = useNavigation()
  const { setStruct } = useCurrentStruct()
  const { setCurrentCommand } = useCurrentCommand()
  const currentItem = items.find((item) => item.id === value)!
  const { area } = useArea()

  const isFavor = area.favorCommands?.includes(currentItem?.id!)
  const isCreation = !!currentItem?.data?.creation
  const isStruct = !!struct

  return (
    <>
      {isCreation && (
        <MenuItem
          shortcut=""
          onSelect={() => {
            push({ path: '/edit-creation' })
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
      )}
      {!isCreation && (
        <MenuItem
          shortcut="↵"
          onSelect={() => {
            if (command) {
              if (command.data.struct) {
                selectStruct(command)
              } else {
                handleSelect(command)
              }
            }

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
      )}
      {!!struct && (
        <MenuItem
          shortcut=""
          onSelect={() => {
            push({ path: '/edit-struct' })
            setStruct(struct.raw)
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <div className="">
              <BracesIcon size={16} />
            </div>
            <div>
              <Trans>Edit Struct</Trans>
            </div>
          </Box>
        </MenuItem>
      )}
      <MenuItem
        shortcut=""
        onSelect={() => {
          push({ path: '/configure-shortcut' })
          setCurrentCommand(currentItem!)
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div className="">
            <KeyboardIcon size={16} />
          </div>
          <div>
            <Trans>Configure Shortcut</Trans>
          </div>
        </Box>
      </MenuItem>
      {isFavor && (
        <>
          <MenuItem
            shortcut=""
            onSelect={async () => {
              const idx = area.favorCommands.indexOf(currentItem.id!)
              if (idx > 0) {
                await store.area.moveCommandFavorUp(currentItem.id!)
                toast.success(t`Moved up in Favorites`)
              }
              close()
            }}
            aria-disabled={area.favorCommands.indexOf(currentItem.id!) === 0}
          >
            <Box toCenterY gap2 inlineFlex>
              <div>
                <MoveUp size={16} />
              </div>
              <div>
                <Trans>Move Up in Favorites</Trans>
              </div>
            </Box>
          </MenuItem>
          <MenuItem
            shortcut=""
            onSelect={async () => {
              const idx = area.favorCommands.indexOf(currentItem.id!)
              if (idx > -1 && idx < area.favorCommands.length - 1) {
                await store.area.moveCommandFavorDown(currentItem.id!)
                toast.success(t`Moved down in Favorites`)
              }
              close()
            }}
            aria-disabled={
              area.favorCommands.indexOf(currentItem.id!) ===
              area.favorCommands.length - 1
            }
          >
            <Box toCenterY gap2 inlineFlex>
              <div>
                <MoveDownIcon size={16} />
              </div>
              <div>
                <Trans>Move Down in Favorites</Trans>
              </div>
            </Box>
          </MenuItem>
        </>
      )}

      <MenuItem
        shortcut=""
        onSelect={() => {
          if (isFavor) {
            store.area.removeCommandFromFavorites(currentItem.id!)
            toast.info(t`Removed from Favorites`)
          } else {
            store.area.addCommandToFavorites(currentItem.id!)
            toast.info(t`Added to Favorites`)
          }
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div>
            {isFavor && <StarOffIcon size={16} />}
            {!isFavor && <StarIcon size={16} />}
          </div>
          <div>
            {isFavor ? (
              <Trans>Remove from Favorites</Trans>
            ) : (
              <Trans>Add to Favorites</Trans>
            )}
          </div>
        </Box>
      </MenuItem>

      {isCreation && (
        <MenuItem
          shortcut=""
          onSelect={async () => {
            if (!currentItem.data.creation) return
            try {
              await store.creations.deleteCreation(
                currentItem.data.creation.raw,
              )
              toast.success(t`Creation deleted successfully`)
              setTimeout(() => {
                appEmitter.emit('REFRESH_COMMANDS')
              }, 10)
            } catch (error) {
              toast.error(t`Failed to delete`)
            }
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex className="text-red-500">
            <div>
              <Trash2Icon />
            </div>
            <div>
              <Trans>Delete Creation</Trans>
            </div>
          </Box>
        </MenuItem>
      )}

      {isStruct && (
        <MenuItem
          shortcut=""
          onSelect={async () => {
            if (!struct) return

            try {
              await store.structs.deleteStruct(struct.id)
              toast.success(t`Struct deleted successfully`)
              setTimeout(() => {
                appEmitter.emit('REFRESH_COMMANDS', struct.id)
                reset()
              }, 10)
            } catch (error) {
              toast.error(t`Failed to delete`)
            }
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex className="text-red-500">
            <div>
              <Trash2Icon />
            </div>
            <div>
              <Trans>Delete Struct</Trans>
            </div>
          </Box>
        </MenuItem>
      )}
    </>
  )
}

interface StructActionsProps {
  close: () => void
}

function StructActions({ close }: StructActionsProps) {
  const { value } = useValue()
  const { push } = useNavigation()
  return (
    <>
      <MenuItem
        shortcut=""
        onSelect={() => {
          push({ path: '/edit-creation' })
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

import { useEffect, useMemo, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Kbd } from '@penx/components/Kbd'
import { appEmitter } from '@penx/emitter'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { useFilterPopover } from '~/hooks/useFilterPopover'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './CommandComponents'

export enum TaskNav {
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
  UPCOMING = 'UPCOMING',
  ALL = 'ALL',
}

function useOnCmdK(fn: () => void, open: boolean) {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'f' && e.metaKey) {
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

export const FilterPopover = ({}: Props) => {
  const labelMaps: Record<string, any> = {
    [TaskNav.TODAY]: <Trans>Today</Trans>,
    [TaskNav.TOMORROW]: <Trans>Tomorrow</Trans>,
    [TaskNav.UPCOMING]: <Trans>Upcoming</Trans>,
    [TaskNav.ALL]: <Trans>All</Trans>,
  }
  const { open, value, state, setOpen, setState } = useFilterPopover()

  useOnCmdK(() => {
    setTimeout(() => {
      if (!open) appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      setOpen(!open)
    }, 0)
  }, open)

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
        <div
          className={cn(
            'no-drag text-foreground/60 flex w-[240px] cursor-pointer items-center justify-between gap-2 rounded-md py-2 pl-3 pr-1 text-sm',
            'bg-foreground/10',
          )}
        >
          <div>
            <div>{labelMaps[value || TaskNav.TODAY]}</div>
          </div>
          <Box toCenterY gap1>
            <Kbd>⌘</Kbd>
            <Kbd>F</Kbd>
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
        className="action-menu z-50 w-[240px] p-0"
        align="end"
        sideOffset={12}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
          }
        }}
      >
        <Command className="w-full p-0">
          <CommandInput
            className="border-foreground/10 border-b px-3 py-2.5"
            placeholder={t`Search...`}
          />
          <CommandList
            className="overflow-auto px-2 py-2"
            style={{
              overscrollBehavior: 'contain',
              transition: '100ms ease',
              transitionProperty: 'height',
            }}
          >
            <CommandGroup>
              <StructActions />
            </CommandGroup>
          </CommandList>
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
        "transition-normal data-[selected='true']:bg-foreground/10 text-foreground/80 flex h-9 cursor-pointer items-center gap-2 rounded-md px-2 text-sm",
        className,
      )}
      onSelect={() => {
        onSelect?.()
      }}
      onClick={() => {
        onSelect?.()
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

interface StructActionsProps {}

function StructActions({}: StructActionsProps) {
  const { setState, setOpen, setValue } = useFilterPopover()

  const labelMaps: Record<string, any> = {
    [TaskNav.TODAY]: <Trans>Today</Trans>,
    [TaskNav.TOMORROW]: <Trans>Tomorrow</Trans>,
    [TaskNav.UPCOMING]: <Trans>Upcoming</Trans>,
    [TaskNav.ALL]: <Trans>All</Trans>,
  }
  return (
    <>
      {Object.values(TaskNav).map((key) => (
        <MenuItem
          shortcut=""
          onSelect={() => {
            setState({
              open: false,
              value: key,
            })
            // console.log('========key:', key)
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <div>{labelMaps[key]}</div>
          </Box>
        </MenuItem>
      ))}
    </>
  )
}

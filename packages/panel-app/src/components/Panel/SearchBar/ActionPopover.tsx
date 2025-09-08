import { useEffect, useMemo, useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Kbd } from '@penx/components/Kbd'
import { appEmitter } from '@penx/emitter'
import { useCreations } from '@penx/hooks/useCreations'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { useActionPopover } from '../../../hooks/useActionPopover'
import { useCurrentCommand } from '../../../hooks/useCurrentCommand'
import { useItems } from '../../../hooks/useItems'
import { navigation, useQueryNavigations } from '../../../hooks/useNavigation'
import { useValue } from '../../../hooks/useValue'
import { ICommandItem } from '../../../lib/types'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './../CommandComponents'
import { RootActions } from './RootActions'
import { StructActions } from './StructActions'

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

  const { current } = useQueryNavigations()

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
          <div className="flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </div>
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
            className="border-foreground/10 w-full border-t px-3 py-3 focus-visible:outline-none"
            placeholder={t`Search for actions...`}
          />
        </Command>
      </PopoverContent>
    </Popover>
  )
}

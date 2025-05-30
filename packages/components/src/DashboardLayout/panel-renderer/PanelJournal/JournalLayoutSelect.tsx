'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { CalendarDays, LayoutDashboardIcon } from 'lucide-react'
import { Drawer } from 'vaul'
import {
  JournalLayout,
  updateJournalLayout,
  useJournalLayout,
} from '@penx/hooks/useJournalLayout'
import { Button } from '@penx/uikit/ui/button'
import { DialogHeader } from '@penx/uikit/ui/dialog'
import { cn } from '@penx/utils'
import { MenuItem } from './MenuItem'

interface Props {}

export function JournalLayoutSelect({}: Props) {
  const [open, setOpen] = useState(false)
  const { data: layout, isLoading } = useJournalLayout()
  return (
    <div>
      <Button
        size="icon"
        className="size-8"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <LayoutDashboardIcon size={18} />
      </Button>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            className={cn(
              'bg-background text-foreground fixed bottom-0 left-0 right-0 mt-24 flex h-fit max-h-[90vh] flex-col rounded-t-[10px] px-4 pb-6 outline-none dark:bg-[#0a0a0a]',
            )}
            style={{
              // boxShadow:
              //   '0 -4px 12px rgba(0, 0, 0, 0.05),    0 -8px 25px rgba(0, 0, 0, 0.1),0 -16px 50px rgba(0, 0, 0, 0.1)',
              filter: 'drop-shadow(0 -8px 25px rgba(0, 0, 0, 0.15))',
            }}
          >
            <div
              aria-hidden
              className="bg-foreground/30 mx-auto mb-4 mt-2 h-1 w-10 shrink-0 rounded-full"
            />

            <DialogHeader className="hidden">
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="mb-2 text-center font-bold">
              <Trans>Layout</Trans>
            </div>
            {layout && (
              <div className="divide-foreground/5 divide-y rounded-xl dark:bg-neutral-900">
                <MenuItem
                  checked={layout == JournalLayout.BUBBLE}
                  onClick={() => {
                    updateJournalLayout(JournalLayout.BUBBLE)
                    setOpen(false)
                  }}
                >
                  <Trans>Bubble</Trans>
                </MenuItem>
                <MenuItem
                  checked={layout == JournalLayout.CARD}
                  onClick={() => {
                    updateJournalLayout(JournalLayout.CARD)
                    setOpen(false)
                  }}
                >
                  <Trans>Card</Trans>
                </MenuItem>
                <MenuItem
                  checked={layout == JournalLayout.LIST}
                  onClick={() => {
                    updateJournalLayout(JournalLayout.LIST)
                    setOpen(false)
                  }}
                >
                  <Trans>List</Trans>
                </MenuItem>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { ListFilterIcon } from 'lucide-react'
import { Drawer } from 'vaul'
import { Struct } from '@penx/domain'
import { useActiveStruct } from '@penx/hooks/useActiveStruct'
import { useStructs } from '@penx/hooks/useStructs'
import { Button } from '@penx/uikit/ui/button'
import { DialogHeader } from '@penx/uikit/ui/dialog'
import { cn } from '@penx/utils'
import { MenuItem } from './MenuItem'

interface Props {}

export function StructTypeSelect({}: Props) {
  const [open, setOpen] = useState(false)
  const { structs } = useStructs()
  const { struct, setStruct } = useActiveStruct()

  function onChange(value: Struct | null) {
    setStruct(value)
    setOpen(false)
  }
  return (
    <div>
      <Button
        size="icon"
        className="size-8"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <ListFilterIcon size={18} />
      </Button>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            className={cn(
              'bg-background text-foreground fixed bottom-0 left-0 right-0 mt-24 flex h-fit max-h-[90vh] flex-col rounded-t-[10px] px-4 pb-6 outline-none dark:bg-neutral-800',
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

            <MenuItem
              checked={!struct}
              onClick={() => {
                onChange(null as any)
              }}
            >
              <Trans>All</Trans>
            </MenuItem>

            {structs.map((item, index) => (
              <MenuItem
                key={item.id}
                checked={struct?.id == item.id}
                onClick={() => {
                  onChange(item)
                }}
              >
                {item.name}
              </MenuItem>
            ))}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}

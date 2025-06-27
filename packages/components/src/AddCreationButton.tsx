'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { EllipsisIcon, PlusIcon } from 'lucide-react'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { StructName } from '@penx/widgets/StructName'
import { ColorfulStructIcon } from './ColorfulStructIcon'
import { useStructDialog } from './StructDialog/useStructDialog'

interface Props {
  className?: string
}

export function AddCreationButton({ className }: Props) {
  const addCreation = useAddCreation()
  const [open, setOpen] = useState(false)
  const { structs } = useStructs()
  const structDialog = useStructDialog()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'hover:bg-foreground/10 bg-background size-8 rounded-lg',
            className,
          )}
          onClick={() => {}}
        >
          <PlusIcon size={20} className="" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="flex max-h-96 w-56 flex-col p-0"
      >
        <div className="text-foreground/50 border-foreground/8 flex h-9 shrink-0 items-center border-b px-2 text-sm">
          <Trans>My structs</Trans>
        </div>
        <div className="flex flex-1 flex-col overflow-auto p-2">
          {structs.map((struct) => {
            return (
              <MenuItem
                key={struct.id}
                className="group/struct flex h-9 gap-2 px-1"
                onClick={async () => {
                  addCreation({ type: struct.type, isAddPanel: true })
                  setOpen(false)
                }}
              >
                <ColorfulStructIcon
                  struct={struct}
                  className="size-6 rounded-md"
                  emojiSize={14}
                />
                <span>
                  <StructName struct={struct!} />
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-foreground/10 ml-auto hidden size-7 rounded-md group-hover/struct:flex"
                  onClick={(e) => {
                    e.stopPropagation()
                    store.panels.openStruct(struct.id)
                  }}
                >
                  <EllipsisIcon className="text-foreground/60 size-4" />
                </Button>
              </MenuItem>
            )
          })}
        </div>

        <div className="border-foreground/8 border-t p-1">
          <MenuItem
            className="h-9"
            onClick={() => {
              structDialog.setIsOpen(true)
              setOpen(false)
            }}
          >
            <PlusIcon size={20}></PlusIcon>
            <div>
              <Trans>Create struct</Trans>
            </div>
          </MenuItem>
        </div>
      </PopoverContent>
    </Popover>
  )
}

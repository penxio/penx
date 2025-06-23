import React, { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { MyListForm } from './MyListForm'
import { useMyListDialog } from './useMyListDialog'

export const AddMyListButton = () => {
  const { isOpen, setIsOpen } = useMyListDialog()
  return (
    <>
      <Button variant="ghost" size="icon" className="size-8 p-0">
        <PlusIcon
          size={20}
          className="text-foreground/60 cursor-pointer"
          onClick={(e) => {
            setIsOpen(true)
          }}
        />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn('text-foreground sm:max-w-[520px]')}
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <Trans>New list</Trans>
            </DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <MyListForm />
        </DialogContent>
      </Dialog>
    </>
  )
}

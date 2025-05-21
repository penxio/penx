'use client'

import { Trans } from '@lingui/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { CreateStructForm } from './CreateStructForm'
import { EditStructForm } from './EditStructForm'
import { useStructDialog } from './useStructDialog'

export function StructDialog() {
  const { isOpen, setIsOpen, struct } = useStructDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        className="text-foreground sm:max-w-[520px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {!!struct ? (
              <Trans id="Update struct"></Trans>
            ) : (
              <Trans id="Create struct"></Trans>
            )}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        {!!struct ? <EditStructForm /> : <CreateStructForm />}
      </DialogContent>
    </Dialog>
  )
}

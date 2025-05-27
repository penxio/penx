'use client'

import { Trans } from '@lingui/react/macro'
import { Button } from '@penx/uikit/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { AreaForm } from './AreaForm'
import { useAreaDialog } from './useAreaDialog'

export function AreaDialog() {
  const { isOpen, setIsOpen, area } = useAreaDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent
        className="text-foreground sm:max-w-[600px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {!!area ? (
              <Trans>Update area</Trans>
            ) : (
              <Trans>Create area</Trans>
            )}
          </DialogTitle>
        </DialogHeader>
        <AreaForm />
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { Button } from '@penx/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/ui/components/dialog'
import { Trans } from '@lingui/react/macro'
import { AreaForm } from './AreaForm'
import { useAreaDialog } from './useAreaDialog'

export function AreaDialog() {
  const { isOpen, setIsOpen, area: field } = useAreaDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {!!field ? (
              <Trans>Update field</Trans>
            ) : (
              <Trans>Create field</Trans>
            )}
          </DialogTitle>
        </DialogHeader>
        <AreaForm />
      </DialogContent>
    </Dialog>
  )
}

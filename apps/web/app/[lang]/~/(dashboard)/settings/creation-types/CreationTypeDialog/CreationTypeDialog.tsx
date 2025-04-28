import { Trans } from '@lingui/react'
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
import { CreationTypeForm } from './CreationTypeForm'
import { useCreationTypeDialog } from './useCreationTypeDialog'

export function CreationTypeDialog() {
  const { isOpen, setIsOpen, mold } = useCreationTypeDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {!!mold ? (
              <Trans id="Update type"></Trans>
            ) : (
              <Trans id="Add type"></Trans>
            )}
          </DialogTitle>
        </DialogHeader>
        <CreationTypeForm />
      </DialogContent>
    </Dialog>
  )
}

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trans } from '@lingui/react/macro'
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
            {!!mold ? <Trans>Update type</Trans> : <Trans>Add type</Trans>}
          </DialogTitle>
        </DialogHeader>
        <CreationTypeForm />
      </DialogContent>
    </Dialog>
  )
}

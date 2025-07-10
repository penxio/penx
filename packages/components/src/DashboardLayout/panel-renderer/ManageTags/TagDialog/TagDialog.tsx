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
import { TagForm } from './TagForm'
import { useTagDialog } from './useTagDialog'

export function TagDialog() {
  const { isOpen, setIsOpen, tag: navLink } = useTagDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {!navLink ? <Trans>Add tag</Trans> : <Trans>Edit tag</Trans>}
          </DialogTitle>
        </DialogHeader>
        <TagForm />
      </DialogContent>
    </Dialog>
  )
}

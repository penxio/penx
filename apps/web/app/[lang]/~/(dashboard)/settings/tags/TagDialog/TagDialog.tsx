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
            {!navLink ? (
              <Trans>Add navigation</Trans>
            ) : (
              <Trans>Edit navigation</Trans>
            )}
          </DialogTitle>
        </DialogHeader>
        <TagForm />
      </DialogContent>
    </Dialog>
  )
}

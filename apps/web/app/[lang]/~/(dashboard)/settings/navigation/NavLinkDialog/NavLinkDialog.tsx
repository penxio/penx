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
import { NavLinkForm } from './NavLinkForm'
import { useNavLinkDialog } from './useNavLinkDialog'

export function NavLinkDialog() {
  const { isOpen, setIsOpen, navLink } = useNavLinkDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {!navLink ? (
              <Trans id="Add navigation"></Trans>
            ) : (
              <Trans id="Edit navigation"></Trans>
            )}
          </DialogTitle>
        </DialogHeader>
        <NavLinkForm />
      </DialogContent>
    </Dialog>
  )
}

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/ui/components/dialog'
import { PasswordForm } from './PasswordForm'
import { usePasswordDialog } from './usePasswordDialog'

interface Props {}

export function PasswordDialog({}: Props) {
  const { isOpen, setIsOpen } = usePasswordDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Username and Password</DialogTitle>
          <DialogDescription>Set username and password</DialogDescription>
        </DialogHeader>

        <PasswordForm />
      </DialogContent>
    </Dialog>
  )
}

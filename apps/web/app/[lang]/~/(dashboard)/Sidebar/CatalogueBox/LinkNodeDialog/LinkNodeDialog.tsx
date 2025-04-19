'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/ui/dialog'
import { LinkNodeForm } from './LinkNodeForm'
import { useLinkNodeDialog } from './useLinkNodeDialog'

interface Props {}

export function LinkNodeDialog({}: Props) {
  const { isOpen, setIsOpen, node } = useLinkNodeDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">
            {node ? 'Edit link' : 'Add link'}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <LinkNodeForm />
      </DialogContent>
    </Dialog>
  )
}

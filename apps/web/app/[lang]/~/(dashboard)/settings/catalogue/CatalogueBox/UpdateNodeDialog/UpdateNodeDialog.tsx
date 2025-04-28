'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { useCatalogue } from '../hooks/useCatalogue'
import { UpdateNodeForm } from './UpdateNodeForm'
import { useUpdateNodeDialog } from './useUpdateNodeDialog'

interface Props {}

export function UpdateNodeDialog({}: Props) {
  const { isOpen, setIsOpen } = useUpdateNodeDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Rename</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <UpdateNodeForm />
      </DialogContent>
    </Dialog>
  )
}

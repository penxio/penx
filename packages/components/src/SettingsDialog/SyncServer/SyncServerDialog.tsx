'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { SyncServerForm } from './SyncServerForm'
import { useSyncServerDialog } from './useSyncServerDialog'

export function SyncServerDialog() {
  const { open, setOpen } = useSyncServerDialog()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-foreground sm:max-w-[520px]">
        <DialogTitle className="">Add sync server</DialogTitle>
        <DialogDescription className=""></DialogDescription>
        <SyncServerForm />
      </DialogContent>
    </Dialog>
  )
}

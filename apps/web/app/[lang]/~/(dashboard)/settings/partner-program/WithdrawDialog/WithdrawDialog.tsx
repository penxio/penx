'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useWithdrawDialog } from './useWithdrawDialog'
import { WithdrawForm } from './WithdrawForm'

export function WithdrawDialog() {
  const { isOpen, setIsOpen } = useWithdrawDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Withdraw</DialogTitle>
        </DialogHeader>
        <WithdrawForm />
      </DialogContent>
    </Dialog>
  )
}

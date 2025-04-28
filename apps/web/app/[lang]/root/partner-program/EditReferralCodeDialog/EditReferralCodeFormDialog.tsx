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
import { trpc } from '@penx/trpc-client'
import { PenSquareIcon } from 'lucide-react'
import { EditReferralCodeForm } from './EditReferralCodeForm'
import { useEditReferralCodeDialog } from './useEditReferralCodeDialog'

export function EditReferralCodeFormDialog() {
  const { isOpen, setIsOpen } = useEditReferralCodeDialog()
  const { data } = trpc.user.getReferralCode.useQuery()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger asChild>
        <PenSquareIcon
          size={16}
          className="text-foreground/60 hover:text-foreground cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update referral code</DialogTitle>
        </DialogHeader>
        {data && <EditReferralCodeForm />}
      </DialogContent>
    </Dialog>
  )
}

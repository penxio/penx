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
import { trpc } from '@/lib/trpc'
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

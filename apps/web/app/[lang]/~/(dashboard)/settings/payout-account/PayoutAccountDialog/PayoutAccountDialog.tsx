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
import { PayoutAccountForm } from './PayoutAccountForm'
import { usePayoutAccountDialog } from './usePayoutAccountDialog'

export function PayoutAccountDialog() {
  const { isOpen, setIsOpen, payoutAccount } = usePayoutAccountDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogDescription className="hidden"></DialogDescription>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {!!payoutAccount ? 'Edit' : 'Add'} payout account
          </DialogTitle>
        </DialogHeader>
        <PayoutAccountForm />
      </DialogContent>
    </Dialog>
  )
}

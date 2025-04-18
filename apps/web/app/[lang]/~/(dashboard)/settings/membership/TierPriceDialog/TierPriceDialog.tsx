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
import { TierPriceForm } from './TierPriceForm'
import { useTierPriceDialog } from './useTierPriceDialog'

export function TierPriceDialog() {
  const { isOpen, setIsOpen, tier } = useTierPriceDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Update price</DialogTitle>
        </DialogHeader>
        <TierPriceForm />
      </DialogContent>
    </Dialog>
  )
}

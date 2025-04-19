import { Button } from '@penx/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/ui/components/dialog'
import { ProductPriceForm } from './ProductPriceForm'
import { useProductPriceDialog } from './useProductPriceDialog'

export function ProductPriceDialog() {
  const { isOpen, setIsOpen } = useProductPriceDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Update price</DialogTitle>
        </DialogHeader>
        <ProductPriceForm />
      </DialogContent>
    </Dialog>
  )
}

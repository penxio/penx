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

import { Button } from '@penx/uikit/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/ui/dialog'
import { PropForm } from './PropForm'
import { usePropDialog } from './usePropDialog'

export function PropDialog() {
  const { isOpen, setIsOpen, prop } = usePropDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {!!prop ? 'Update property' : 'Add Property'}
          </DialogTitle>
        </DialogHeader>
        <PropForm />
      </DialogContent>
    </Dialog>
  )
}

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
import { TierForm } from './TierForm'
import { useTierDialog } from './useTierDialog'

export function TierDialog() {
  const { isOpen, setIsOpen, tier } = useTierDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{!!tier ? 'Update tier' : 'Add tier'}</DialogTitle>
        </DialogHeader>
        <TierForm />
      </DialogContent>
    </Dialog>
  )
}

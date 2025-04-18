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

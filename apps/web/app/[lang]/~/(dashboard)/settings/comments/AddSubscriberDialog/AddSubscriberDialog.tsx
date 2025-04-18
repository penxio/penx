import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AddSubscriberForm } from './AddSubscriberForm'
import { useAddSubscriberDialog } from './useAddSubscriberDialog'

export function AddSubscriberDialog() {
  const { isOpen, setIsOpen } = useAddSubscriberDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add subscriber</DialogTitle>
        </DialogHeader>
        <AddSubscriberForm />
      </DialogContent>
    </Dialog>
  )
}

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
import { PublishForm } from './PublishForm'
import { usePublishDialog } from './usePublishDialog'

export function PublishDialog() {
  const { isOpen, setIsOpen } = usePublishDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[500px]">
        <PublishForm />
      </DialogContent>
    </Dialog>
  )
}

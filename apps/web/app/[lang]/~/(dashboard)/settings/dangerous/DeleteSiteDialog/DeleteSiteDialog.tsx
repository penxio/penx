import { Plus } from 'lucide-react'
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
import { DeleteSiteForm } from './DeleteSiteForm'
import { useDeleteSiteDialog } from './useDeleteSiteDialog'

export function DeleteSiteDialog() {
  const { isOpen, setIsOpen } = useDeleteSiteDialog()
  const preventClose = (e: any) => {
    e.preventDefault()
  }
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete site</DialogTitle>
          <DialogDescription>
            This project will be deleted, along with all of its data.
          </DialogDescription>
        </DialogHeader>
        <DeleteSiteForm />
      </DialogContent>
    </Dialog>
  )
}

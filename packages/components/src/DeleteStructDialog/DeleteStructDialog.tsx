'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { localDB } from '@penx/local-db'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useDeleteStructDialog } from './useDeleteStructDialog'

interface Props {}

export function DeleteStructDialog({}: Props) {
  const { isOpen, setIsOpen, struct } = useDeleteStructDialog()
  const [loading, setLoading] = useState(false)

  async function deleteStruct() {
    setLoading(true)
    try {
      await store.structs.deleteStruct(struct.id)
      setIsOpen(false)
      toast.success('Struct deleted successfully')
    } catch (error) {
      toast.error('Failed to delete')
    }
    setLoading(false)
  }
  if (!struct) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="">
        <DialogHeader className="">
          <DialogTitle className="">
            Are you sure delete this struct permanently?
          </DialogTitle>
          <DialogDescription>
            All creations will be deleted, once deleted, You can't undo this
            action.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild>
            <Button className="w-20" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={loading}
            variant="destructive"
            onClick={deleteStruct}
          >
            {loading ? <LoadingDots className="bg-white" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

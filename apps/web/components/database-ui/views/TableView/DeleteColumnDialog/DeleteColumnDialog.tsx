'use client'

import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/ui/dialog'
import { sleep } from '@penx/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useDeleteColumnDialog } from './useDeleteColumnDialog'

interface Props {
  onDeleteColumn: (columnId: string) => Promise<void>
}

export function DeleteColumnDialog({ onDeleteColumn }: Props) {
  const { isOpen, setIsOpen, column: field } = useDeleteColumnDialog()
  const [loading, setLoading] = useState(false)

  async function deleteColumn() {
    setLoading(true)
    try {
      await onDeleteColumn(field?.id)
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to delete')
    }
    setLoading(false)
  }

  if (!field) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="">
            Are you sure delete it permanently?
          </DialogTitle>
          <DialogDescription>
            Once deleted, You can't undo this action.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="text-left">
          <DialogClose asChild>
            <Button className="w-20" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={loading}
            variant="destructive"
            onClick={deleteColumn}
          >
            {loading ? <LoadingDots className="bg-white" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

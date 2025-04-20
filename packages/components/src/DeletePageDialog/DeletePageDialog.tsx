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
import { usePages } from '@/hooks/usePages'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { localDB } from '@/lib/local-db'
import { api } from '@penx/trpc-client'
import { toast } from 'sonner'
import { useDeletePageDialog } from './useDeleteDatabaseDialog'

interface Props {}

export function DeletePageDialog({}: Props) {
  const { isOpen, setIsOpen, pageId } = useDeletePageDialog()
  const [loading, setLoading] = useState(false)
  const { refetch } = usePages()

  async function deletePage() {
    setLoading(true)
    try {
      await api.creation.delete.mutate(pageId)
      await localDB.page.delete(pageId)
      await refetch()
      toast.success('Page deleted successfully')
      setIsOpen(false)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to delete')
    }
    setLoading(false)
  }
  if (!pageId) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="">
            Are you sure delete this page permanently?
          </DialogTitle>
          <DialogDescription>
            Once deleted, You can't undo this action.
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
            onClick={deletePage}
          >
            {loading ? <LoadingDots className="bg-white" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

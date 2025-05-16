'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useDatabases } from '@penx/hooks/useDatabases'
import { api } from '@penx/trpc-client'
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
import { useDeleteDatabaseDialog } from './useDeleteDatabaseDialog'

interface Props {}

export function DeleteDatabaseDialog({}: Props) {
  const { isOpen, setIsOpen, databaseId } = useDeleteDatabaseDialog()
  const [loading, setLoading] = useState(false)
  const { refetch } = useDatabases()

  async function deleteField() {
    setLoading(true)
    try {
      await api.database.deleteDatabase.mutate(databaseId)
      await refetch()
      toast.success('Database deleted successfully')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to delete')
    }
    setLoading(false)
  }
  if (!databaseId) return null

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="">
            Are you sure delete this database permanently?
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
            onClick={deleteField}
          >
            {loading ? <LoadingDots className="bg-white" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

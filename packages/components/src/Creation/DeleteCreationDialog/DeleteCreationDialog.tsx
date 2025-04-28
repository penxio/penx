'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { toast } from 'sonner'
import { deleteCreation, refetchCreations } from '@penx/hooks/useCreations'
import { closePanel, resetPanels, usePanels } from '@penx/hooks/usePanels'
import { localDB } from '@penx/local-db'
import { api } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/loading-dots'
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
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useDeleteCreationDialog } from './useDeleteCreationDialog'

interface Props {}

export function DeleteCreationDialog({}: Props) {
  const { isOpen, setIsOpen, creation } = useDeleteCreationDialog()
  const [loading, setLoading] = useState(false)
  const { panels } = usePanels()

  async function deletePost() {
    setLoading(true)
    try {
      deleteCreation(creation)
      toast.success('Deleted successfully')
      setIsOpen(false)
      const panel = panels.find((p) => p.creationId === creation.id)
      closePanel(panel?.id!)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to delete')
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="">
            <Trans id="Are you sure delete it permanently?"></Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans id="Once deleted, You can't undo this action."></Trans>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild>
            <Button className="w-20" variant="outline">
              <Trans id="Cancel"></Trans>
            </Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={loading}
            variant="destructive"
            onClick={deletePost}
          >
            {loading ? (
              <LoadingDots className="bg-background" />
            ) : (
              <Trans id="Delete"></Trans>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

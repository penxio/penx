'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { isMobileApp } from '@penx/constants'
import { usePanels } from '@penx/hooks/usePanels'
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
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useDeleteCreationDialog } from './useDeleteCreationDialog'

interface Props {}

export function DeleteCreationDialog({}: Props) {
  const { isOpen, setIsOpen, creation } = useDeleteCreationDialog()
  const [loading, setLoading] = useState(false)
  const { panels } = usePanels()

  async function remove() {
    setLoading(true)
    try {
      store.creations.deleteCreation(creation.raw)
      toast.success('Deleted successfully')
      setIsOpen(false)
      const panel = panels.find((p) => p.creationId === creation.id)
      store.panels.closePanel(panel?.id!)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to delete')
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="">
        <DialogHeader className="">
          <DialogTitle className="">
            <Trans>Are you sure delete it permanently?</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>Once deleted, You can't undo this action.</Trans>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter
          className={cn(
            'flex flex-row justify-between gap-2',
            isMobileApp && 'justify-center',
          )}
        >
          <DialogClose asChild>
            <Button className="w-20" variant="outline">
              <Trans>Cancel</Trans>
            </Button>
          </DialogClose>
          <Button
            className="w-20"
            disabled={loading}
            variant="destructive"
            onClick={remove}
          >
            {loading ? (
              <LoadingDots className="bg-background" />
            ) : (
              <Trans>Delete</Trans>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

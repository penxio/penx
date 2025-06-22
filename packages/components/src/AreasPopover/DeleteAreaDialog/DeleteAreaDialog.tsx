'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
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
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useDeleteAreaDialog } from './useDeleteAreaDialog'

interface Props {}

export function DeleteAreaDialog({}: Props) {
  const { isOpen, setIsOpen, area } = useDeleteAreaDialog()
  const [loading, setLoading] = useState(false)
  const { panels } = usePanels()

  async function remove() {
    setLoading(true)
    try {
      const areas = await store.areas.deleteArea(area.raw)
      const nextArea = areas.find((a) => a.props.isGenesis)!
      store.area.set(nextArea)
      store.visit.setAndSave({ activeAreaId: nextArea.id })
      store.creations.refetchCreations(nextArea.id)
      toast.success('Deleted successfully')
      setIsOpen(false)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to delete')
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent closable={false} className="">
        <DialogHeader className="">
          <DialogTitle className="text-foreground">
            <Trans>Are you sure delete it permanently?</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>Once deleted, You can't undo this action.</Trans>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild>
            <Button className="w-20 text-foreground" variant="outline">
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

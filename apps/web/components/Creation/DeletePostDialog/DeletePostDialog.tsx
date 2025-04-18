'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { refetchAreaCreations } from '@/hooks/useAreaCreations'
import { closePanel, resetPanels, usePanels } from '@/hooks/usePanels'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { localDB } from '@/lib/local-db'
import { api } from '@/lib/trpc'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { useDeletePostDialog } from './useDeletePostDialog'

interface Props {}

export function DeletePostDialog({}: Props) {
  const { isOpen, setIsOpen, creation: post } = useDeletePostDialog()
  const [loading, setLoading] = useState(false)
  const { panels } = usePanels()

  async function deletePost() {
    setLoading(true)
    try {
      await api.creation.delete.mutate(post.id)
      toast.success('Deleted successfully')

      await refetchAreaCreations()
      setIsOpen(false)
      const panel = panels.find((p) => p.creation?.id === post.id)
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
            <Trans>Are you sure delete it permanently?</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>Once deleted, You can't undo this action.</Trans>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild>
            <Button className="w-20" variant="outline">
              <Trans>Cancel</Trans>
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
              <Trans>Delete</Trans>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

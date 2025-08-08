'use client'

import { Trans } from '@lingui/react/macro'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { PublishStructContent } from './PublishStructContent'
import { usePublishStructDialog } from './usePublishStructDialog'

export function PublishStructDialog() {
  const { isOpen, setIsOpen, struct } = usePublishStructDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        className="text-foreground sm:max-w-[460px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <Trans>Publish struct</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>
              Publish{' '}
              <span className="text-foreground font-bold">{struct?.name}</span>{' '}
              to marketplace
            </Trans>
          </DialogDescription>
        </DialogHeader>
        <PublishStructContent />
      </DialogContent>
    </Dialog>
  )
}

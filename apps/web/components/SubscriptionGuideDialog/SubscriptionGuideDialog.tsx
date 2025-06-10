'use client'

import { Trans } from '@lingui/react/macro'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { SubscriptionGuideDialogContent } from './SubscriptionGuideDialogContent'
import { useSubscriptionGuideDialog } from './useSubscriptionGuideDialog'

interface Props {}

export function SubscriptionGuideDialog({}: Props) {
  const { isOpen, setIsOpen } = useSubscriptionGuideDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="">
            <Trans>Subscribe to PenX</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>
              Subscribe to PenX to support us in building the best product and
              enjoy the features:
            </Trans>
          </DialogDescription>
        </DialogHeader>
        <SubscriptionGuideDialogContent />
      </DialogContent>
    </Dialog>
  )
}

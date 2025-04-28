'use client'

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
          <DialogTitle className="">Subscribe to PenX</DialogTitle>
          <DialogDescription>
            Subscribe to Penx to support us in building the best product and
            enjoy the features:
          </DialogDescription>
        </DialogHeader>
        <SubscriptionGuideDialogContent />
      </DialogContent>
    </Dialog>
  )
}

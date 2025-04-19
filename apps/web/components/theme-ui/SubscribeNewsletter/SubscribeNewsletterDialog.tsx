'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/ui/components/dialog'
import { Site } from '@/lib/theme.types'
import { SubscribeNewsletterForm } from './SubscribeNewsletterForm'
import { useSubscribeNewsletterDialog } from './useSubscribeNewsletterDialog'

interface Props {
  site: Site
}

export function SubscribeNewsletterDialog({ site }: Props) {
  const { isOpen, setIsOpen } = useSubscribeNewsletterDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[520px]">
        <DialogHeader className="hidden">
          <DialogTitle className=""></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SubscribeNewsletterForm site={site} />
      </DialogContent>
    </Dialog>
  )
}

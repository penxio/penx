'use client'

import { Button } from '@/components/ui/button'
import { useAddSubscriberDialog } from './AddSubscriberDialog/useAddSubscriberDialog'

export function AddSubscriberButton() {
  const { setIsOpen } = useAddSubscriberDialog()
  return (
    <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
      Add subscribers
    </Button>
  )
}

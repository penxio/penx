'use client'

import { Button } from '@penx/uikit/button'
import { useAddSubscriberDialog } from './AddSubscriberDialog/useAddSubscriberDialog'

export function AddSubscriberButton() {
  const { setIsOpen } = useAddSubscriberDialog()
  return (
    <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
      Add subscribers
    </Button>
  )
}

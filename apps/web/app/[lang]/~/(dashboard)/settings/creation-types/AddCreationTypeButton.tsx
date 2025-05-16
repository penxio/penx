'use client'

import { toast } from 'sonner'
import { Button } from '@penx/uikit/button'

export function AddCreationTypeButton() {
  return (
    <Button
      onClick={() => {
        toast.info('Coming soon! This feature is currently in development.')
      }}
    >
      Add
    </Button>
  )
}

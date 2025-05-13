'use client'

import { KeyIcon } from 'lucide-react'
import { usePasswordDialog } from '@penx/components/usePasswordDialog'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

export function LinkPasswordButton() {
  const { setIsOpen } = usePasswordDialog()

  return (
    <div>
      <Button
        size="lg"
        variant="outline"
        className={cn('w-full gap-2 rounded-lg')}
        onClick={async () => {
          setIsOpen(true)
        }}
      >
        <KeyIcon size={16} />
        <div className="">Set password</div>
      </Button>
    </div>
  )
}

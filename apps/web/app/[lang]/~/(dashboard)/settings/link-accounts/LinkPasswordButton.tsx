'use client'

import { usePasswordDialog } from '@/components/PasswordDialog/usePasswordDialog'
import { Button } from '@penx/ui/components/button'
import { cn } from '@/lib/utils'
import { KeyIcon } from 'lucide-react'

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

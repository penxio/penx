'use client'

import { useAreaDialog } from '@/components/AreaDialog/useAreaDialog'
import { Button } from '@penx/ui/components/button'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'

export function AreaHeader() {
  const { setIsOpen } = useAreaDialog()
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">
          <Trans>Area</Trans>
        </h2>
      </div>
      <Button
        variant="default"
        size="icon"
        className="h-8 w-8"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon size={24} />
      </Button>
    </div>
  )
}

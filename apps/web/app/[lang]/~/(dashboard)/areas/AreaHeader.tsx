'use client'

import { Trans } from '@lingui/react'
import { PlusIcon } from 'lucide-react'
import { useAreaDialog } from '@penx/components/AreaDialog/useAreaDialog'
import { Button } from '@penx/uikit/ui/button'

export function AreaHeader() {
  const { setIsOpen } = useAreaDialog()
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">
          <Trans id="Area"></Trans>
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

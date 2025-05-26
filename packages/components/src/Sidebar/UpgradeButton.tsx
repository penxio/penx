'use client'

import { ZapIcon } from 'lucide-react'
import { usePlanListDialog } from '@penx/components/usePlanListDialog'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'

interface Props {}

export function UpgradeButton({}: Props) {
  const { data: session } = useSession()
  const { setIsOpen } = usePlanListDialog()

  if (session?.planType === 'FREE') {
    return (
      <div className="mb-4 px-4">
        <Button
          size="lg"
          className="flex w-full items-center gap-1 rounded-full font-bold"
          onClick={async () => {
            setIsOpen(true)
          }}
        >
          <ZapIcon size={16} />
          <span>Upgrade</span>
        </Button>
      </div>
    )
  }
  return null
}

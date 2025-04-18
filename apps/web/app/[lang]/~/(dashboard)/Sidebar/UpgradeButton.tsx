'use client'

import { usePlanListDialog } from '@/components/PlanList/usePlanListDialog'
import { useSession } from '@/components/session'
import { Button } from '@/components/ui/button'
import { PlanType } from '@penx/db/client'
import { ZapIcon } from 'lucide-react'

interface Props {}

export function UpgradeButton({}: Props) {
  const { data: session } = useSession()
  const { setIsOpen } = usePlanListDialog()

  if (session?.planType === PlanType.FREE) {
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

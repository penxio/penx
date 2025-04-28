'use client'

import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
import { useSite } from '@penx/hooks/useSite'
import { PayoutAccountDialog } from './PayoutAccountDialog/PayoutAccountDialog'
import { usePayoutAccountDialog } from './PayoutAccountDialog/usePayoutAccountDialog'
import { PayoutAccountList } from './PayoutAccountList'

export const dynamic = 'force-static'

export default function Page() {
  const { setState } = usePayoutAccountDialog()

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Payout accounts</div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setState({
              isOpen: true,
              payoutAccount: null as any,
              index: -1,
            })
          }}
        >
          Add payout account
        </Button>
      </div>

      <PayoutAccountDialog />
      <PayoutAccountList />
    </div>
  )
}

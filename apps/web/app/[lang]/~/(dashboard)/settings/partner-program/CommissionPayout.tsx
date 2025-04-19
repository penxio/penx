'use client'

import { Button } from '@penx/ui/components/button'
import { trpc } from '@/lib/trpc'
import { useWithdrawDialog } from './WithdrawDialog/useWithdrawDialog'
import { WithdrawDialog } from './WithdrawDialog/WithdrawDialog'

interface Props {}

export function CommissionPayout({}: Props) {
  const withdrawDialog = useWithdrawDialog()
  const limit = Number(process.env.NEXT_PUBLIC_MIN_WITHDRAWAL_LIMIT)
  const { data: balance } = trpc.affiliate.commissionBalance.useQuery()

  if (!balance) return null

  return (
    <div className="">
      <WithdrawDialog />
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="text-xl font-semibold">Commission withdrawal</div>
          <div className="text-foreground/60">
            PenX currently only supports withdrawals to crypto wallet.
          </div>
        </div>
        <div className="border-foreground/5 rounded-xl border p-5">
          <div className="text-foreground/60">Balances</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">
                ${(balance.withdrawable / 100).toFixed(2)}
              </div>
              <div className="text-foreground/60 text-sm">
                Locked: ${(balance.locked / 100).toFixed(2)}
              </div>
              <div className="text-foreground/60 text-sm">
                Withdrawing: ${(balance.withdrawing / 100).toFixed(2)}
              </div>
            </div>
            <div>
              <Button
                disabled={balance.withdrawable < limit}
                onClick={() => {
                  withdrawDialog.setIsOpen(true)
                }}
              >
                Withdraw
              </Button>
              <div className="text-foreground/50 text-sm">Minimum $50</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

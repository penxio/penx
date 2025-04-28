'use client'

import { useMemo } from 'react'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Button } from '@penx/uikit/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@penx/uikit/card'
import { Balance } from '@penx/types'
import { useWithdrawDialog } from './WithdrawDialog/useWithdrawDialog'
import { WithdrawDialog } from './WithdrawDialog/WithdrawDialog'

interface Props {}

export function Payout({}: Props) {
  const site = useSiteContext()
  const withdrawDialog = useWithdrawDialog()
  const limit = Number(process.env.NEXT_PUBLIC_MIN_WITHDRAWAL_LIMIT)

  const balance = useMemo(() => {
    if (!site.balance) {
      return {
        withdrawable: 0,
        withdrawing: 0,
        locked: 0,
      } as Balance
    }
    return site.balance as Balance
  }, [site.balance])
  return (
    <div className="space-y-2">
      <WithdrawDialog />
      <div className="text-2xl font-bold">Payout</div>
      <Card>
        <CardHeader>
          <CardTitle>Withdrawals</CardTitle>
          <CardDescription>
            PenX currently only supports withdrawals to crypto wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}

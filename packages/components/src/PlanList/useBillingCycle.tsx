'use client'

import { atom, useAtom } from 'jotai'
import { BillingCycle } from '@penx/db/client'

const billingCycleAtom = atom<BillingCycle>(BillingCycle.MONTHLY)

export function useBillingCycle() {
  const [cycle, setCycle] = useAtom(billingCycleAtom)
  return {
    cycle,
    isMonthly: cycle === BillingCycle.MONTHLY,
    setCycle,
  }
}

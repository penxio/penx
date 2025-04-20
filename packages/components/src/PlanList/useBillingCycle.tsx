'use client'

import { BillingCycle } from '@prisma/client'
import { atom, useAtom } from 'jotai'

const billingCycleAtom = atom<BillingCycle>(BillingCycle.MONTHLY)

export function useBillingCycle() {
  const [cycle, setCycle] = useAtom(billingCycleAtom)
  return {
    cycle,
    isMonthly: cycle === BillingCycle.MONTHLY,
    setCycle,
  }
}

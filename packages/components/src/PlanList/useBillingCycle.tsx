'use client'

import { atom, useAtom } from 'jotai'

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

const billingCycleAtom = atom<BillingCycle>(BillingCycle.MONTHLY)

export function useBillingCycle() {
  const [cycle, setCycle] = useAtom(billingCycleAtom)
  return {
    cycle,
    isMonthly: cycle === BillingCycle.MONTHLY,
    setCycle,
  }
}

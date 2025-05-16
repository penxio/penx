'use client'

import { BillingCycle } from '@penx/db/client'
import { Badge } from '@penx/uikit/badge'
import { ToggleGroup, ToggleGroupItem } from '@penx/uikit/toggle-group'
import { useBillingCycle } from './useBillingCycle'

export function BillingCycleSelect() {
  const { cycle, setCycle } = useBillingCycle()
  return (
    <ToggleGroup
      className="bg-accent h-12 rounded-lg p-1"
      value={cycle}
      onValueChange={(v) => {
        if (!v) return
        setCycle(v as BillingCycle)
      }}
      type="single"
    >
      <ToggleGroupItem
        className="bg-accent ring-foreground data-[state=on]:bg-background flex h-full w-32 flex-1 cursor-pointer rounded-lg text-sm font-semibold"
        value={BillingCycle.MONTHLY}
      >
        Monthly
      </ToggleGroupItem>

      <ToggleGroupItem
        value={BillingCycle.YEARLY}
        className="bg-accent ring-foreground data-[state=on]:bg-background flex h-full w-36 flex-1 cursor-pointer rounded-lg text-sm font-semibold"
      >
        Yearly
        <Badge className="ml-1 shrink-0">25% off</Badge>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

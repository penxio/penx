'use client'

import { Check, CheckIcon, XIcon } from 'lucide-react'
import { cn } from '@penx/utils'
import { UpgradeButton } from './UpgradeButton'
import { useBillingCycle } from './useBillingCycle'

type Benefit = {
  ok: boolean
  text: string
}

interface Props {
  name: string
  // type: PlanType
  type: any
  monthlyPrice: number
  annualPrice: number
  collaboratorCount?: number
  benefits: Benefit[]
  isBeliever?: boolean
}

export function PlanItem({
  name,
  type,
  monthlyPrice,
  annualPrice,
  benefits,
  collaboratorCount,
  isBeliever,
}: Props) {
  const { isMonthly } = useBillingCycle()

  // if (isBeliever) {
  //   return (
  //     <div>
  //       <div>Everything in Pro Plan</div>
  //     </div>
  //   )
  // }
  return (
    <div className="bg-background/40 border-foreground/10 flex w-full flex-col space-y-8 border-r border-t px-8 py-8 dark:border">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-xl font-bold">{name}</div>
        {isBeliever && (
          <div className="flex items-center gap-1">
            <div className="text-3xl font-bold">$512</div>
            <div className=""> / 5 years</div>
          </div>
        )}
        {!isBeliever && (
          <div className="flex items-center gap-1">
            <div className="text-3xl font-bold">
              {isMonthly ? `$${monthlyPrice}` : `$${annualPrice}`}
            </div>
            <div className=""> / {isMonthly ? 'month' : 'year'}</div>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-3">
        {benefits.map((benefit, index) => (
          <BenefitItem key={benefit.text} benefit={benefit} />
        ))}
      </div>
      <div className="text-center">
        <UpgradeButton type={type} isBeliever={isBeliever} />
      </div>
    </div>
  )
}

function BenefitItem({ benefit }: { benefit: Benefit }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {benefit.ok && <CheckIcon className="text-green-500" size={16} />}
      {!benefit.ok && <XIcon className="text-foreground/40" size={16} />}
      <div
        className={cn(
          'text-foreground/70 text-sm',
          !benefit.ok && 'text-foreground/40 line-through',
        )}
      >
        {benefit.text}
      </div>
    </div>
  )
}

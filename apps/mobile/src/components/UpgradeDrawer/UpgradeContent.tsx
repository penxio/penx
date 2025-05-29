'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { CheckIcon } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'

interface Props {}

export function UpgradeContent({}: Props) {
  const [isMonthly, setIsMonthly] = useState(true)
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="text-foreground flex items-center justify-center gap-2 text-3xl font-bold">
        <span>PenX</span>
        <span className="bg-brand rounded-lg px-2 py-0.5 text-xl text-white">
          PRO
        </span>
      </div>
      <div className="flex-1 text-base"></div>

      <div className="bg-foreground/5 flex flex-col gap-2 rounded-xl p-4">
        <BenefitItem>Instant cloud sync</BenefitItem>
        <BenefitItem>Unlimited number of notes</BenefitItem>
        <BenefitItem>20GB storage</BenefitItem>
        <BenefitItem>Unlimit devices</BenefitItem>
        <BenefitItem>Create own digital garden</BenefitItem>
      </div>
      <div
        className={cn(
          'border-foreground/20 flex items-center justify-between rounded-xl border-2 p-4',
          isMonthly && 'border-foreground',
        )}
        onClick={() => setIsMonthly(true)}
      >
        <div>Pro monthly</div>
        <div className="flex items-center">
          <span className="mr-1 text-3xl font-bold">$10</span>/ month
        </div>
      </div>

      <div
        className={cn(
          'border-foreground/20 flex items-center justify-between rounded-xl border-2 p-4',
          !isMonthly && 'border-foreground',
        )}
        onClick={() => setIsMonthly(false)}
      >
        <div>Pro yearly</div>
        <div className="flex items-center">
          <span className="mr-1 text-3xl font-bold">$90</span>/ year
        </div>
      </div>

      <div className="flex justify-center">
        <Button size="lg" className="rounded-full">
          <Trans>Subscribe now</Trans>
        </Button>
      </div>
    </div>
  )
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <CheckIcon className="text-green-500" size={16} />
      <div className={cn('text-foreground/')}>{children}</div>
    </div>
  )
}

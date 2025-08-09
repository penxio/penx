'use client'

import { useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { Purchases, PurchasesOffering } from '@revenuecat/purchases-capacitor'
import { useQuery } from '@tanstack/react-query'
import { CheckIcon } from 'lucide-react'
import { updateSession } from '@penx/session'
import { BillingCycle, PlanType, SubscriptionSource } from '@penx/types'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { AnimateToggleGroup } from '../AnimateToggleGroup'
import { getPackage, SubscriptionType } from './lib/getPackage'
import { purchasePackage } from './lib/purchasePackage'

interface Props {
  onSubscribeSuccess: () => void
}

export function UpgradeContent({ onSubscribeSuccess }: Props) {
  const [isMonthly, setIsMonthly] = useState(true)
  const [type, setType] = useState(SubscriptionType.standard)
  const isPro = type === SubscriptionType.pro
  const [purchasing, setPurchasing] = useState(false)

  const { isLoading, data } = useQuery({
    queryKey: ['offerings'],
    queryFn: async () => {
      try {
        const offerings = await Purchases.getOfferings()
        // console.log(
        //   '=========offerings:',
        //   Object.keys(offerings.all),
        //   offerings.all['pro'].monthly,
        // )

        return offerings.all
      } catch (error) {
        console.log('======error:', error)
        return {} as Record<string, PurchasesOffering>
      }
    },
  })

  return (
    <div className="flex flex-1 flex-col gap-4 pt-3">
      <div className="text-foreground flex items-center justify-center gap-2 text-3xl font-bold">
        <span>PenX</span>
        <span className="bg-foreground text-background rounded-lg px-2 py-0.5 text-lg">
          <Trans>Member</Trans>
        </span>
      </div>

      <AnimateToggleGroup
        options={[
          {
            value: SubscriptionType.standard,
            label: <Trans>PRO</Trans>,
          },
          {
            value: SubscriptionType.pro,
            label: (
              <div className="flex items-center gap-1">
                <span>
                  <Trans>PRO</Trans>
                </span>
                <span className="bg-foreground text-background h-5 rounded-md px-2 text-sm dark:bg-black dark:text-white">
                  AI
                </span>
              </div>
            ),
          },
        ]}
        value={type}
        onChange={(v) => setType(v)}
      />

      <div className="flex flex-1 flex-col justify-end">
        <div className="bg-foreground/5 flex flex-col gap-2 rounded-xl p-4">
          <BenefitItem>
            <Trans>Cloud sync</Trans>
          </BenefitItem>
          <BenefitItem>
            <Trans>Unlimited number of notes</Trans>
          </BenefitItem>
          <BenefitItem>
            <Trans>Unlimited number of areas</Trans>
          </BenefitItem>
          <BenefitItem>
            <Trans>Share note to friends</Trans>
          </BenefitItem>
          {!isPro && (
            <BenefitItem>
              <Trans>1GB/month storage</Trans>
            </BenefitItem>
          )}
          {isPro && (
            <BenefitItem>
              <Trans>2GB/month storage</Trans>
            </BenefitItem>
          )}
          <BenefitItem>
            <Trans>Unlimit devices</Trans>
          </BenefitItem>
          {isPro && (
            <BenefitItem>
              <Trans>AI features for notes</Trans>
            </BenefitItem>
          )}
        </div>
      </div>
      <div
        className={cn(
          'border-foreground/20 flex items-center justify-between rounded-xl border-2 p-4',
          isMonthly && 'border-foreground',
        )}
        onClick={() => {
          impact()
          setIsMonthly(true)
        }}
      >
        <div>
          {isPro ? <Trans>Pro + AI monthly</Trans> : <Trans>PRO monthly</Trans>}
        </div>
        <div className="flex items-center">
          <span className="mr-1 text-3xl font-bold">
            {isPro ? '$10' : '$5'}
          </span>
          / <Trans>month</Trans>
        </div>
      </div>

      <div
        className={cn(
          'border-foreground/20 flex items-center justify-between rounded-xl border-2 p-4',
          !isMonthly && 'border-foreground',
        )}
        onClick={() => {
          impact()
          setIsMonthly(false)
        }}
      >
        {isPro ? <Trans>Pro + AI yearly</Trans> : <Trans>PRO yearly</Trans>}
        <div className="flex items-center">
          <span className="mr-1 text-3xl font-bold">
            {isPro ? '$80' : '$40'}
          </span>
          / <Trans>year</Trans>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          size="xl"
          className="w-full"
          disabled={isLoading || purchasing}
          onClick={async () => {
            impact()
            setPurchasing(true)
            try {
              const pkg = getPackage(type, isMonthly, data!)
              console.log('=======pkg:', pkg)
              const planType =
                type === SubscriptionType.standard
                  ? PlanType.STANDARD
                  : PlanType.PRO
              const billingCycle = isMonthly
                ? BillingCycle.MONTHLY
                : BillingCycle.YEARLY

              await purchasePackage(planType, billingCycle, pkg)

              await updateSession({
                subscriptionSource: SubscriptionSource.APPLE,
                planType,
                billingCycle,
                subscriptionStatus: 'active',
              })

              onSubscribeSuccess()
            } catch (error) {
              console.log('========error:', error)
            }
            setPurchasing(false)
          }}
        >
          {purchasing ? (
            <LoadingDots className="bg-background" />
          ) : (
            <Trans>Subscribe now</Trans>
          )}
        </Button>
      </div>
    </div>
  )
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <CheckIcon className="text-green-500" size={16} />
      <div className={cn('text-foreground font-semibold')}>{children}</div>
    </div>
  )
}

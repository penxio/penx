import { PlanType } from '@prisma/client'
import { BillingCycleSelect } from './BillingCycleSelect'
import { PlanItem } from './PlanItem'
import { PricingSlogan } from './PricingSlogan'

export function PlanList() {
  return (
    <div className="flex flex-col items-center gap-8 pb-20">
      <PricingSlogan />

      <BillingCycleSelect />

      <div className="border-foreground/10 grid grid-cols-1 justify-center border-b border-l sm:grid-cols-2 md:grid-cols-4">
        <PlanItem
          monthlyPrice={0}
          annualPrice={0}
          name="Free"
          type={PlanType.FREE}
          collaboratorCount={1}
          benefits={[
            { ok: true, text: '1 co-creators' },
            { ok: true, text: '5 free official themes' },
            { ok: true, text: 'Custom domain' },
            { ok: true, text: '10k Pageviews/mo' },
            { ok: false, text: 'Podcast' },
            { ok: false, text: 'Sending newsletters' },
            { ok: false, text: 'AI assistance' },
            { ok: false, text: 'One-to-one custom theme' },
            { ok: false, text: 'One-to-One support in meeting' },
          ]}
        />
        <PlanItem
          monthlyPrice={5.12}
          annualPrice={46.08}
          name="Basic"
          type={PlanType.BASIC}
          collaboratorCount={1}
          benefits={[
            { ok: true, text: '1 co-creators' },
            { ok: true, text: 'Unlimited themes' },
            { ok: true, text: 'Custom domain' },
            { ok: true, text: '100k Pageviews/mo' },
            { ok: false, text: 'Podcast' },
            { ok: false, text: 'Sending newsletters' },
            { ok: false, text: 'AI assistance' },
            { ok: false, text: 'One-to-one custom theme' },
            { ok: false, text: 'One-to-One support in meeting' },
          ]}
        />
        <PlanItem
          monthlyPrice={10.24}
          annualPrice={92.16}
          name="Standard"
          type={PlanType.STANDARD}
          collaboratorCount={3}
          benefits={[
            { ok: true, text: '3 co-creators' },
            { ok: true, text: 'Unlimited themes' },
            { ok: true, text: 'Custom domain' },
            { ok: true, text: '500k Pageviews/mo' },
            { ok: true, text: 'Podcast' },
            { ok: true, text: 'Sending newsletters' },
            { ok: false, text: 'AI assistance' },
            { ok: false, text: 'One-to-one custom theme' },
            { ok: false, text: 'One-to-One support in meeting' },
          ]}
        />
        <PlanItem
          monthlyPrice={25.6}
          annualPrice={230.4}
          name="Pro"
          type={PlanType.PRO}
          collaboratorCount={3}
          benefits={[
            { ok: true, text: '5 co-creators' },
            { ok: true, text: 'Unlimited themes' },
            { ok: true, text: 'Custom domain' },
            { ok: true, text: '1000k Pageviews/mo' },
            { ok: true, text: 'Sending newsletters' },
            { ok: true, text: 'AI assistance' },
            { ok: true, text: 'Podcast' },
            { ok: true, text: 'One-to-one custom theme' },
            { ok: true, text: 'One-to-One support in meeting' },
          ]}
        />
      </div>
    </div>
  )
}

import { PlanType } from '@penx/types'
import { BillingCycleSelect } from './BillingCycleSelect'
import { PlanItem } from './PlanItem'
import { PricingSlogan } from './PricingSlogan'

export function PlanList() {
  return (
    <div className="flex flex-col items-center gap-8 pb-20">
      <PricingSlogan />

      <BillingCycleSelect />

      <div className="grid w-full grid-cols-3 justify-center gap-4">
        <PlanItem
          monthlyPrice={0}
          annualPrice={0}
          name="Free"
          type={PlanType.FREE}
          collaboratorCount={1}
          benefits={[
            { ok: true, text: 'All editor feature' },
            { ok: true, text: 'Unlimit blocks' },
            { ok: true, text: 'Manual sync' },
            { ok: false, text: 'Instant sync' },
            { ok: false, text: 'Unlimit share' },
          ]}
        />
        <PlanItem
          monthlyPrice={5}
          annualPrice={40}
          name="PRO"
          type={PlanType.STANDARD}
          collaboratorCount={1}
          benefits={[
            { ok: true, text: 'All editor feature' },
            { ok: true, text: 'Unlimit blocks' },
            { ok: true, text: 'Instant sync' },
            { ok: true, text: 'Unlimit device' },
            { ok: true, text: '1GB/month storage' },
            { ok: true, text: 'Unlimit share' },
          ]}
        />
        <PlanItem
          monthlyPrice={10}
          annualPrice={80}
          name="PRO+AI"
          type={PlanType.PRO}
          collaboratorCount={3}
          benefits={[
            { ok: true, text: 'All editor feature' },
            { ok: true, text: 'Unlimit blocks' },
            { ok: true, text: 'Instant sync' },
            { ok: true, text: 'Unlimit device' },
            { ok: true, text: '2GB/month storage' },
            { ok: true, text: 'AI features for notes' },
          ]}
        />
        {/* <PlanItem
          monthlyPrice={25.6}
          annualPrice={230.4}
          name="Believer"
          type={PlanType.BELIEVER}
          collaboratorCount={3}
          isBeliever
          benefits={[{ ok: true, text: 'Everything in Pro Plan' }]}
        /> */}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { StripeType } from '@penx/db/client'
import { updateSiteState, useQuerySite } from '@penx/hooks/useQuerySite'
import { queryClient } from '@penx/query-client'
import { trpc } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { ConnectStripe } from './ConnectStripe'
import { MembershipTiers } from './MembershipTiers'
import { PlatformStrip } from './PlatformStrip'
import { StripeTypeSelect } from './StripeTypeSelect'

export function Membership() {
  const { site } = useQuerySite()

  if (site.stripeType === StripeType.NONE) {
    return <MembershipSetup />
  }

  if (site.stripeType === StripeType.OWN) {
    return <StripeConnect />
  }
  return <PlatformStrip />
}

function MembershipSetup() {
  const { site } = useQuerySite()
  const [value, setValue] = useState<StripeType>(StripeType.NONE)
  const { isPending, mutateAsync } = trpc.site.selectStripeType.useMutation()
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="text-2xl font-bold">Setup your paid membership</div>
        <div className="text-foreground/60">
          Earn recurring income from Your Most Loyal Supporters.
        </div>
      </div>

      <StripeTypeSelect value={value} onSelect={setValue} />
      <Button
        className="w-40"
        disabled={isPending}
        onClick={async () => {
          if (value === StripeType.NONE) {
            toast.info('Please select a type')
            return
          }
          await mutateAsync({ stripeType: value })

          updateSiteState({
            stripeType: value,
          })
        }}
      >
        {isPending ? <LoadingDots /> : <span>Setup membership</span>}
      </Button>
    </div>
  )
}

function StripeConnect() {
  const { data, isLoading } = trpc.stripe.authInfo.useQuery()
  const tiers = trpc.tier.listSiteTiers.useQuery()

  if (isLoading || tiers.isLoading) {
    return (
      <div>
        <LoadingDots className="bg-background" />
      </div>
    )
  }

  if (!data?.account) return <ConnectStripe />

  return <MembershipTiers type={StripeType.OWN} />
}

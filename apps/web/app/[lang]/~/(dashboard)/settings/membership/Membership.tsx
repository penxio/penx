'use client'

import { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/ui/components/button'
import { updateSiteState } from '@/hooks/useSite'
import { queryClient } from '@/lib/queryClient'
import { trpc } from '@/lib/trpc'
import { StripeType } from '@penx/db/client'
import { toast } from 'sonner'
import { ConnectStripe } from './ConnectStripe'
import { MembershipTiers } from './MembershipTiers'
import { PlatformStrip } from './PlatformStrip'
import { StripeTypeSelect } from './StripeTypeSelect'

export function Membership() {
  const site = useSiteContext()

  if (site.stripeType === StripeType.NONE) {
    return <MembershipSetup />
  }

  if (site.stripeType === StripeType.OWN) {
    return <StripeConnect />
  }
  return <PlatformStrip />
}

function MembershipSetup() {
  const site = useSiteContext()
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

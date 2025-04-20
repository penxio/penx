'use client'

import { StripeType } from '@prisma/client'
import { MembershipTiers } from './MembershipTiers'
import { Payout } from './Payout'

export function PlatformStrip() {
  return (
    <div className="max-w-2xl space-y-8">
      <MembershipTiers type={StripeType.PLATFORM} />
      <Payout />
    </div>
  )
}

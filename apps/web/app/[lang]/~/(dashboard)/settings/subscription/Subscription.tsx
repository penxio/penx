'use client'

import { useMemo } from 'react'
import { UseCouponCode } from '@/components/UseCouponCode'
import { BillingCycle, PlanType } from '@penx/db/client'
import { format } from 'date-fns'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Separator } from '@penx/uikit/separator'
import { toReadableTime } from '@penx/utils'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface Props {}

export function Subscription({}: Props) {
  const site = useSiteContext()
  const { data: session, update } = useSession()
  const time = useMemo(() => {
    if (!session?.believerPeriodEnd) return null
    const now = Date.now()
    const end = new Date(session?.believerPeriodEnd!).getTime()
    return end >= now ? toReadableTime((end - now) / 1000) : ''
  }, [session])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">PenX</div>
          <Badge>{session?.planType || 'Free'}</Badge>

          {session?.isBeliever &&
            session.billingCycle !== BillingCycle.COUPON && (
              <Badge variant="success">Believer</Badge>
            )}

          {!session?.isFree && session?.isSubscription && (
            <Badge variant="secondary">{session?.billingCycle}</Badge>
          )}

          {!session?.isFree && session?.subscriptionStatus === 'canceled' && (
            <Badge variant="secondary">Canceled</Badge>
          )}
        </div>

        <div className="text-foreground/60">
          Subscribe to Penx to support us in building the best product.
        </div>

        {session?.isBeliever && (
          <div className="flex items-center gap-2">
            <div className="text-foreground/50">Pro plan expires at</div>
            <div className="text-lg font-semibold">
              {format(new Date(session?.believerPeriodEnd!), 'LLL do, yyyy')}
            </div>
            {time && <div className="text-foreground/50">({time})</div>}
          </div>
        )}

        <div className="space-x-2">
          <Button
            size="lg"
            onClick={() => {
              // if (isConnected) {
              //   subscriptionDialog.setIsOpen(true)
              // } else {
              //   openConnectModal?.()
              // }
            }}
          >
            {!session?.isFree && session?.subscriptionStatus !== 'canceled'
              ? 'Change plan'
              : 'Upgrade'}
          </Button>

          {!session?.isFree &&
            session?.isSubscription &&
            session?.subscriptionStatus !== 'canceled' && (
              <ConfirmDialog
                title="Cancel subscription?"
                content="Are you sure you want to cancel subscription?"
                onConfirm={async () => {
                  await api.billing.cancel.mutate()
                  await update({
                    type: 'cancel-subscription',
                    siteId: site.id,
                  })
                }}
              >
                <Button className="text-foreground/40" variant="link">
                  Cancel subscription
                </Button>
              </ConfirmDialog>
            )}
        </div>
      </div>

      <Separator className="my-6"></Separator>
      <UseCouponCode></UseCouponCode>
    </div>
  )
}

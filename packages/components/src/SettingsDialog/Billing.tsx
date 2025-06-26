'use client'

import { useMemo } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { usePlanListDialog } from '@penx/components/PlanList/usePlanListDialog'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { refreshSession, useSession } from '@penx/session'
import { BillingCycle } from '@penx/types'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Separator } from '@penx/uikit/separator'
import { toReadableTime } from '@penx/utils'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { UseCouponCode } from './UseCouponCode'

interface Props {}

export function Billing({}: Props) {
  const site = useSiteContext()
  const planDialog = usePlanListDialog()
  const { data: session, update } = useSession()
  const time = useMemo(() => {
    if (!session?.believerPeriodEnd) return null
    const now = Date.now()
    const end = new Date(session?.believerPeriodEnd!).getTime()
    return end >= now ? toReadableTime((end - now) / 1000) : ''
  }, [session])


  const planType = useMemo(() => {
    if (session.isFree) {
      return (
        <Badge>
          <Trans>Free</Trans>
        </Badge>
      )
    }
    if (session.subscriptionStatus === 'canceled') {
      return <Badge variant="secondary">Canceled</Badge>
    }
    if (session?.isBeliever && session.billingCycle !== BillingCycle.COUPON) {
      return <Badge variant="success">Believer</Badge>
    }

    return <Badge>{session.isPro ? 'PRO+AI' : 'PRO'}</Badge>
  }, [session])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">PenX</div>
          {planType}
        </div>

        <div className="text-foreground/60">
          <Trans>
            Subscribe to PenX to support us in building the best product.
          </Trans>
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
              planDialog.setIsOpen(true)
            }}
          >
            {!session?.isFree && session?.subscriptionStatus !== 'canceled' ? (
              <Trans>Change plan</Trans>
            ) : (
              <Trans>Upgrade</Trans>
            )}
          </Button>

          {!session?.isFree &&
            session?.isSubscription &&
            session?.subscriptionStatus !== 'canceled' && (
              <ConfirmDialog
                title={t`Cancel subscription?`}
                content={t`Are you sure you want to cancel subscription?`}
                onConfirm={async () => {
                  await api.cancelSubscription()
                  await refreshSession()
                  toast.success(t`Cancel subscription successfully`)
                }}
              >
                <Button className="text-foreground/40" variant="link">
                  <Trans>Cancel subscription</Trans>
                </Button>
              </ConfirmDialog>
            )}
        </div>
      </div>

      <Separator className="my-6"></Separator>
      <UseCouponCode />
    </div>
  )
}

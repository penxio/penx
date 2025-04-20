'use client'

import { useMemo } from 'react'
import { PlateEditor } from '@penx/editor/plate-editor'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useLoginDialog } from '@penx/components/LoginDialog/useLoginDialog'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { Card } from '@penx/uikit/ui/card'
import { usePathname } from '@penx/libs/i18n'
import { Site } from '@penx/types'
import { trpc } from '@penx/trpc-client'
import { StripeInfo } from '@penx/types'
import { cn } from '@penx/utils'
import { Product } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  site: Site
  tier: Product
}

export function TierItem({ tier, site }: Props) {
  const pathname = usePathname()
  const checkout = trpc.stripe.subscribeSiteCheckout.useMutation()
  const cancelSubscription = trpc.stripe.cancelSubscription.useMutation()
  const { data: session, isLoading } = useSession()
  const { setIsOpen } = useLoginDialog()
  const subscriptionRes = trpc.tier.mySubscriptionBySiteId.useQuery(
    { siteId: site.id },
    { enabled: !!session },
  )

  const loading =
    subscriptionRes.isLoading ||
    checkout.isPending ||
    cancelSubscription.isPending

  const hasMember = useMemo(() => {
    if (!subscriptionRes?.data) return false
    const subscription = subscriptionRes?.data
    if (
      subscription.sassCurrentPeriodEnd &&
      subscription.sassSubscriptionStatus === 'active'
    ) {
      return new Date(subscription.sassCurrentPeriodEnd).getTime() > Date.now()
    }
    return false
  }, [subscriptionRes?.data])

  const isMember = useMemo(() => {
    if (!subscriptionRes?.data) return false
    const subscription = subscriptionRes?.data
    if (subscription.productId !== tier.id) return false
    if (
      !subscription.sassCurrentPeriodEnd ||
      subscription.sassSubscriptionStatus === 'canceled'
    ) {
      return false
    }
    return new Date(subscription.sassCurrentPeriodEnd).getTime() > Date.now()
  }, [subscriptionRes?.data])

  return (
    <Card className="bg-background relative flex min-h-[520px] w-[300px] flex-col justify-between gap-4 rounded-xl p-4 shadow-none">
      <div className="space-y-1">
        <div className="flex">
          <div>{tier.name}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold">${Number(tier.price / 100)}</div>
          <div>/ month</div>
        </div>
      </div>

      <div className="flex-1 text-sm">
        <PlateEditor value={tier.description} readonly className="p-0" />
      </div>

      <div className="flex h-10 justify-center">
        <Button
          variant={isMember ? 'secondary' : 'default'}
          disabled={loading || isLoading}
          className="flex w-full items-center gap-1"
          onClick={async () => {
            if (!session) {
              return setIsOpen(true)
            }
            if (hasMember && subscriptionRes?.data?.productId !== tier.id) {
              toast.info(
                'Please cancel subscription before upgrading to this tier.',
              )
              return
            }

            if (isMember) {
              console.log('canceling subscription...')
              await cancelSubscription.mutateAsync({ siteId: site.id })
              await subscriptionRes.refetch()
              toast.success('Subscription canceled successfully.')
            } else {
              const stripeInfo = tier.stripe as StripeInfo
              const res = await checkout.mutateAsync({
                productId: tier.id,
                siteId: site.id,
                priceId: stripeInfo.priceId,
                host: window.location.host,
                pathname: encodeURIComponent(pathname || '/subscribe'),
              })
              console.log('=======res:', res)
              window.location.href = res.url!
            }
          }}
        >
          {!loading && (
            <>
              {isMember && <div>Cancel subscription</div>}
              {!isMember && <div>Subscribe</div>}
              {checkout.isPending && <LoadingDots className="bg-background" />}
            </>
          )}

          {loading && (
            <LoadingDots
              className={cn(
                isMember && 'bg-foreground',
                !isMember && 'bg-background',
              )}
            />
          )}
        </Button>
      </div>
    </Card>
  )
}

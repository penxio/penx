'use client'

import { useMutation } from '@tanstack/react-query'
import { openUrl } from '@tauri-apps/plugin-opener'
import { api } from '@penx/api'
import { isDesktop } from '@penx/constants'
import { usePathname, useRouter } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { PlanType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useLoginDialog } from '@penx/widgets/useLoginDialog'
import { useBillingCycle } from './useBillingCycle'

interface Props {
  type: any
  isBeliever?: boolean
}

export function UpgradeButton({ type, isBeliever }: Props) {
  const { setIsOpen } = useLoginDialog()
  const { data: session } = useSession()
  const { cycle } = useBillingCycle()
  const { push } = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname.includes('/app')

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['checkout'],
    mutationFn: api.checkout,
  })

  const isCurrentPlan =
    type === session?.planType && cycle === session?.billingCycle
  const isFree = type === PlanType.FREE
  const isCanceled = session?.subscriptionStatus === 'canceled'
  const upgradableText = isBeliever ? 'Join' : 'Upgrade'
  function getText() {
    if (session?.subscriptionStatus === 'canceled' && !isFree) {
      return upgradableText
    }
    if (isCurrentPlan) return 'Current plan'
    if (isFree) return 'Free'
    return session?.isFree ? upgradableText : 'Change plan'
  }

  return (
    <Button
      size="lg"
      className="h-12 w-32 rounded-full px-8 font-bold"
      disabled={isPending || (isCurrentPlan && !isCanceled) || isFree}
      onClick={async () => {
        const data = await mutateAsync({
          planType: type,
          billingCycle: cycle,
          host: window.location.host,
          pathname: encodeURIComponent('/app'),
        })
        if (isDesktop) {
          openUrl(data.url!)
        } else {
          location.href = data.url!
        }
        return
      }}
    >
      {!isDashboard && 'Get started'}
      {isDashboard && (isPending ? <LoadingDots /> : getText())}
    </Button>
  )
}

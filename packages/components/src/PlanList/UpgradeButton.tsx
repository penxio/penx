'use client'

import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { usePathname, useRouter } from '@penx/libs/i18n'
import { trpc } from '@penx/trpc-client'
import { PlanType } from '@prisma/client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useBillingCycle } from './useBillingCycle'

interface Props {
  type: PlanType
  isBeliever?: boolean
}

export function UpgradeButton({ type, isBeliever }: Props) {
  const { setIsOpen } = useLoginDialog()
  const { data: session } = useSession()
  const { cycle } = useBillingCycle()
  const { push } = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname.includes('/~/')

  const { isPending, mutateAsync } = trpc.billing.checkout.useMutation()

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
        if (isDashboard) {
          const data = await mutateAsync({
            planType: type,
            billingCycle: cycle,
            host: window.location.host,
            pathname: encodeURIComponent('/~/settings/subscription'),
          })
          console.log('data===>>:', data, data.url)
          location.href = data.url!
          return
        }

        if (!session) {
          setIsOpen(true)
        } else {
          push('/~/settings/subscription')
        }
      }}
    >
      {!isDashboard && 'Get started'}
      {isDashboard && (isPending ? <LoadingDots /> : getText())}
    </Button>
  )
}

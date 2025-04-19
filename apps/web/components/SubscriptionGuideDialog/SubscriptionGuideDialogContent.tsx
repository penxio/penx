'use client'

import { useRouter } from '@/lib/i18n'
import { Check } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { UseCouponCode } from '../UseCouponCode'
import { useSubscriptionGuideDialog } from './useSubscriptionGuideDialog'

export function SubscriptionGuideDialogContent() {
  const { setIsOpen } = useSubscriptionGuideDialog()
  const { push } = useRouter()
  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        <BenefitItem text="Cloud Sync" />
        <BenefitItem text="Web App & Desktop App & Mobile App" />
        <BenefitItem text="Unlimited number of posts, pages, databases" />
        <BenefitItem text="One-to-One support in discord" />
      </div>

      <div className="mt-4">
        <Button
          size="lg"
          className="h-12 px-8 font-bold"
          onClick={() => {
            push('/~/settings/subscription')
            setIsOpen(false)
          }}
        >
          Become a member
        </Button>
      </div>

      <UseCouponCode></UseCouponCode>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="text-green-500" />
      <div className="text-foreground/70">{text}</div>
    </div>
  )
}

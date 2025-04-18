'use client'

import { useState } from 'react'
import { useSession } from '@/components/session'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'
import { LoadingDots } from './icons/loading-dots'
import { useSubscriptionGuideDialog } from './SubscriptionGuideDialog/useSubscriptionGuideDialog'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function UseCouponCode() {
  const [couponCode, setCouponCode] = useState('')
  const { setIsOpen } = useSubscriptionGuideDialog()
  const { update } = useSession()
  const { isPending, mutateAsync } = trpc.coupon.useCouponCode.useMutation()
  return (
    <div className="space-y-3">
      <div className="text-2xl font-bold">Using coupon code</div>
      <div className="text-foreground/60 shrink-0">
        I have a coupon code, apply it now.
      </div>
      <div className="flex items-center gap-2">
        <Input
          size="sm"
          placeholder="Enter coupon code"
          className="rounded-lg"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button
          size="sm"
          disabled={isPending}
          variant="outline-solid"
          className="w-20"
          onClick={async () => {
            try {
              await mutateAsync({ code: couponCode.trim() })
              await update({ type: 'use-coupon' })
              setIsOpen(false)
              toast.success('Coupon code applied successfully')
            } catch (error) {
              toast.error(extractErrorMessage(error) || 'Invalid coupon code')
            }
          }}
        >
          {isPending ? <LoadingDots className="bg-foreground/60" /> : 'Use it'}
        </Button>
      </div>
    </div>
  )
}

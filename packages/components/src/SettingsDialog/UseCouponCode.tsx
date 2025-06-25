'use client'

import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { refreshSession, useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useSubscriptionGuideDialog } from './SubscriptionGuideDialog/useSubscriptionGuideDialog'

export function UseCouponCode() {
  const [couponCode, setCouponCode] = useState('')
  const { setIsOpen } = useSubscriptionGuideDialog()
  const { update } = useSession()
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['useCouponCode'],
    mutationFn: api.useCouponCode,
  })
  return (
    <div className="space-y-3">
      <div className="text-2xl font-bold">
        <Trans>Using coupon code</Trans>
      </div>
      <div className="text-foreground/60 shrink-0">
        <Trans>I have a coupon code, apply it now.</Trans>
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
              await mutateAsync(couponCode.trim())
              await update({ type: 'use-coupon' })
              refreshSession()
              setIsOpen(false)
              toast.success(t`Coupon code applied successfully`)
            } catch (error) {
              console.log('=====xxx error::', error.message)

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

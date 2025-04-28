'use client'

import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSite } from '@penx/hooks/useSite'
import { OrderList } from './OrderList'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Orders</div>
      </div>

      <OrderList site={site} />
    </div>
  )
}

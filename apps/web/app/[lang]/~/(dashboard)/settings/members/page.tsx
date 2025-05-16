'use client'

import { useQuerySite } from '@penx/hooks/useQuerySite'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { ProductList } from './MemberList'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useQuerySite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-2xl font-bold">Members</div>
      </div>

      <ProductList site={site} />
    </div>
  )
}

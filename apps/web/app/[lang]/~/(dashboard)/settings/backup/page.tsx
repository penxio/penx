'use client'

import { useQuerySite } from '@penx/hooks/useQuerySite'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { SyncBox } from './SyncBox/SyncBox'

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

  return <SyncBox />
}

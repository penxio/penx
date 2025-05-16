'use client'

import { useQuerySite } from '@penx/hooks/useQuerySite'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { FeaturesSettingForm } from './FeaturesSettingForm'

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
    <div>
      <FeaturesSettingForm site={site!} />
    </div>
  )
}

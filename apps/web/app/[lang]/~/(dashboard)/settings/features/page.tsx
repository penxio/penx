'use client'

import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSite } from '@penx/hooks/useSite'
import { trpc } from '@penx/trpc-client'
import { FeaturesSettingForm } from './FeaturesSettingForm'

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
    <div>
      <FeaturesSettingForm site={site!} />
    </div>
  )
}

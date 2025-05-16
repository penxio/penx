'use client'

import { useQuerySite } from '@penx/hooks/useQuerySite'
import { Card, CardContent, CardHeader, CardTitle } from '@penx/uikit/card'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { AppearanceSettingForm } from './AppearanceSettingForm'

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
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <AppearanceSettingForm site={site!} />
      </CardContent>
    </div>
  )
}

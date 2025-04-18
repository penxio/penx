'use client'

import { AnalyticsSettingForm } from './AnalyticsSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-6">
      <AnalyticsSettingForm />
    </div>
  )
}

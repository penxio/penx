'use client'

import { PasswordSettingForm } from './PasswordSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-6">
      <PasswordSettingForm />
    </div>
  )
}

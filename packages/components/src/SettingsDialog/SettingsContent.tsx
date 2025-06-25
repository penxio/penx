'use client'

import { Trans } from '@lingui/react/macro'
import { useSession } from '@penx/session'
import { Separator } from '@penx/uikit/ui/separator'
import { Appearance } from './Appearance'
import { Billing } from './Billing'
import { Password } from './Password'
import { Profile } from './Profile'
import { SettingsNav, useSettingsDialog } from './useSettingsDialog'

export function SettingsContent() {
  const { navName } = useSettingsDialog()
  const { session } = useSession()

  const titleNames: Record<string, any> = {
    [SettingsNav.APPEARANCE]: <Trans>Appearance</Trans>,
    [SettingsNav.PROFILE]: <Trans>Profile</Trans>,
    [SettingsNav.PASSWORD]: <Trans>Update password</Trans>,
    [SettingsNav.BILLING]: <Trans>Billing</Trans>,
  }

  return (
    <div className="bg-background flex-1 px-10 py-6">
      <div className="font-bold">{titleNames[navName]}</div>
      <Separator className="my-4" />
      {navName === SettingsNav.APPEARANCE && <Appearance />}
      {navName === SettingsNav.PROFILE && <Profile />}
      {navName === SettingsNav.PASSWORD && <Password />}
      {navName === SettingsNav.BILLING && <Billing />}
    </div>
  )
}

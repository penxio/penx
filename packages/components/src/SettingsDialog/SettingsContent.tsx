'use client'

import { Trans } from '@lingui/react/macro'
import { Separator } from '@penx/uikit/ui/separator'
import { cn } from '@penx/utils'
import { ProviderSetting } from '../AISetting/provider-setting'
import { About } from './About'
import { Appearance } from './Appearance'
import { Billing } from './Billing'
import { EditShortcuts } from './EditShortcuts'
import { Password } from './Password'
import { Profile } from './Profile'
import { RecoveryPhrase } from './RecoveryPhrase/RecoveryPhrase'
import { SyncServer } from './SyncServer/SyncServer'
import { SyncServerDialog } from './SyncServer/SyncServerDialog'
import { SettingsNav, useSettingsDialog } from './useSettingsDialog'

interface Props {
  className?: string
}
export function SettingsContent({ className }: Props) {
  const { navName } = useSettingsDialog()

  const titleNames: Record<string, any> = {
    [SettingsNav.APPEARANCE]: <Trans>Appearance</Trans>,
    [SettingsNav.PROFILE]: <Trans>Profile</Trans>,
    [SettingsNav.PASSWORD]: <Trans>Update password</Trans>,
    [SettingsNav.BILLING]: <Trans>Billing</Trans>,
    [SettingsNav.AI_PROVIDER]: <Trans>Custom AI Provider</Trans>,
    [SettingsNav.RECOVER_PHRASE]: <Trans>Recovery phrase</Trans>,
    [SettingsNav.EDIT_SHORTCUTS]: <Trans>Shortcuts</Trans>,
    [SettingsNav.SYNC_SERVER]: <Trans>Sync server</Trans>,
    [SettingsNav.ABOUT]: <Trans>About</Trans>,
  }

  return (
    <>
      <SyncServerDialog />
      <div
        className={cn(
          'bg-background flex flex-1 flex-col rounded-r-2xl px-10 py-6 dark:bg-neutral-800',
          className,
        )}
      >
        <div className="">
          <span className="no-drag font-bold">{titleNames[navName]}</span>
        </div>
        <Separator className="my-4" />
        <div className="no-drag flex flex-1 flex-col">
          {navName === SettingsNav.APPEARANCE && <Appearance />}
          {navName === SettingsNav.PROFILE && <Profile />}
          {navName === SettingsNav.PASSWORD && <Password />}
          {navName === SettingsNav.BILLING && <Billing />}
          {navName === SettingsNav.EDIT_SHORTCUTS && <EditShortcuts />}
          {navName === SettingsNav.AI_PROVIDER && <ProviderSetting />}
          {navName === SettingsNav.RECOVER_PHRASE && <RecoveryPhrase />}
          {navName === SettingsNav.SYNC_SERVER && <SyncServer />}
          {navName === SettingsNav.ABOUT && <About />}
        </div>
      </div>
    </>
  )
}

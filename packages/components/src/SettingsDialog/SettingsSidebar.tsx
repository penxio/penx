'use client'

import * as React from 'react'
import { Trans } from '@lingui/react/macro'
import {
  CreditCardIcon,
  KeyRoundIcon,
  PaletteIcon,
  UserIcon,
} from 'lucide-react'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'
import { ProfileBasicInfo } from '../ProfileBasicInfo'
import { SettingsNav, useSettingsDialog } from './useSettingsDialog'

export function SettingsSidebar() {
  const { open, setOpen } = useSettingsDialog()
  const { session } = useSession()

  return (
    <div className="bg-foreground/5 flex w-[250px] flex-col gap-5 p-5">
      <ProfileBasicInfo />
      <div className="flex flex-col gap-1">
        <Item icon={<PaletteIcon size={16} />} navName={SettingsNav.APPEARANCE}>
          <Trans>Appearance</Trans>
        </Item>
        <Item icon={<UserIcon size={16} />} navName={SettingsNav.PROFILE}>
          <Trans>Profile</Trans>
        </Item>
        <Item icon={<KeyRoundIcon size={16} />} navName={SettingsNav.PASSWORD}>
          <Trans>Password</Trans>
        </Item>
        <Item icon={<CreditCardIcon size={16} />} navName={SettingsNav.BILLING}>
          <Trans>Billing</Trans>
        </Item>
      </div>
    </div>
  )
}

interface Props {
  icon: React.ReactNode
  children?: React.ReactNode
  active?: boolean
  navName: SettingsNav
}

function Item({ icon, children, active, navName }: Props) {
  const { setNavName, navName: currentNavName } = useSettingsDialog()
  return (
    <div
      className={cn(
        'flex h-8 cursor-pointer items-center gap-2 rounded-md transition-all',
        navName === currentNavName && 'bg-foreground/7 -mx-2 px-2',
      )}
      onClick={() => {
        setNavName(navName)
      }}
    >
      <div className="text-foreground/50">{icon}</div>
      <div className="text-foreground/90 text-[15px]">{children}</div>
    </div>
  )
}

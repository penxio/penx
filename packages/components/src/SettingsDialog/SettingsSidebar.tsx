'use client'

import * as React from 'react'
import { Trans } from '@lingui/react/macro'
import {
  CreditCardIcon,
  DatabaseBackupIcon,
  InfoIcon,
  KeyboardIcon,
  KeyRoundIcon,
  LogOut,
  PaletteIcon,
  ServerIcon,
  UserIcon,
} from 'lucide-react'
import { isDesktop } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { Badge } from '@penx/uikit/ui/badge'
import { cn } from '@penx/utils'
import { ProfileBasicInfo } from '../ProfileBasicInfo'
import { SettingsNav, useSettingsDialog } from './useSettingsDialog'

interface Props {
  className?: string
}
export function SettingsSidebar({ className }: Props) {
  const { logout, session } = useSession()

  return (
    <div
      className={cn(
        'bg-foreground/5 drag flex w-[250px] flex-col gap-5 p-5 dark:bg-neutral-800/50',
        className,
      )}
    >
      {!isDesktop && <ProfileBasicInfo />}

      <div className="no-drag flex flex-1 flex-col gap-1">
        <Item icon={<PaletteIcon size={16} />} navName={SettingsNav.APPEARANCE}>
          <Trans>Appearance</Trans>
        </Item>
        <Item icon={<UserIcon size={16} />} navName={SettingsNav.PROFILE}>
          <Trans>Profile</Trans>
        </Item>
        {isDesktop && (
          <Item
            icon={<KeyboardIcon size={16} />}
            navName={SettingsNav.EDIT_SHORTCUTS}
          >
            <Trans>Shortcuts</Trans>
          </Item>
        )}
        <Item icon={<KeyRoundIcon size={16} />} navName={SettingsNav.PASSWORD}>
          <Trans>Password</Trans>
        </Item>
        <Item icon={<CreditCardIcon size={16} />} navName={SettingsNav.BILLING}>
          <Trans>Billing & Subscriptions</Trans>
        </Item>
        <Item icon={<ServerIcon size={16} />} navName={SettingsNav.SYNC_SERVER}>
          <Trans>Sync server</Trans>
          <Badge
            className="border-foreground/12 text-foreground/60 ml-2 h-6 rounded-full"
            variant="outline"
            size="sm"
          >
            Beta
          </Badge>
        </Item>

        <Item icon={<InfoIcon size={16} />} navName={SettingsNav.ABOUT}>
          <Trans>About</Trans>
        </Item>

        {/* <Item
          icon={<CreditCardIcon size={16} />}
          navName={SettingsNav.RECOVER_PHRASE}
        >
          <Trans>Recovery phrase</Trans>
        </Item> */}

        {session && (
          <div
            className="mt-auto flex cursor-pointer items-center gap-1 text-sm text-red-500"
            onClick={async () => {
              try {
                await logout()
                appEmitter.emit('ON_LOGOUT_SUCCESS')
              } catch (error) {}
            }}
          >
            <LogOut size={18} />
            <Trans>Log out</Trans>
          </div>
        )}
      </div>
    </div>
  )
}

interface ItemProps {
  icon: React.ReactNode
  children?: React.ReactNode
  active?: boolean
  navName: SettingsNav
}

function Item({ icon, children, active, navName }: ItemProps) {
  const { setNavName, navName: currentNavName } = useSettingsDialog()
  return (
    <div
      className={cn(
        'hover:bg-foreground/7 -mx-2 flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 transition-all',
        navName === currentNavName && 'bg-foreground/7',
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

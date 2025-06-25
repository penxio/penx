'use client'

import * as React from 'react'
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
} from 'lucide-react'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { ProfileBasicInfo } from '../ProfileBasicInfo'
import { SettingsContent } from './SettingsContent'
import { SettingsSidebar } from './SettingsSidebar'
import { useSettingsDialog } from './useSettingsDialog'

const data = {
  nav: [
    { name: 'Notifications', icon: Bell },
    { name: 'Navigation', icon: Menu },
    { name: 'Home', icon: Home },
    { name: 'Appearance', icon: Paintbrush },
    { name: 'Messages & media', icon: MessageCircle },
    { name: 'Language & region', icon: Globe },
    { name: 'Accessibility', icon: Keyboard },
    { name: 'Mark as read', icon: Check },
    { name: 'Audio & video', icon: Video },
    { name: 'Connected accounts', icon: Link },
    { name: 'Privacy & visibility', icon: Lock },
    { name: 'Advanced', icon: Settings },
  ],
}

export function SettingsDialog() {
  const { open, setOpen } = useSettingsDialog()
  const { session } = useSession()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[600px] overflow-hidden p-0 sm:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <div className="flex h-full w-full">
          <SettingsSidebar />
          <SettingsContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}

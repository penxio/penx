'use client'

import { useEffect } from 'react'
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
import { SettingsNav, useSettingsDialog } from './useSettingsDialog'

export function SettingsDialog() {
  const { open, setOpen, setState } = useSettingsDialog()
  const { session } = useSession()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background h-[600px] p-0  sm:max-w-[860px]  dark:bg-neutral-900">
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

'use client'

import { ReactNode, useState } from 'react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@penx/uikit/ui/sidebar'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { AppSidebar } from '../Sidebar/app-sidebar'
import { PanelList } from './PanelList'

export function PanelLayout({ children }: { children: ReactNode }) {
  useSiteTags()
  useCollaborators()
  return (
    <SidebarProvider className="">
      <AppSidebar />
      <SidebarInset className="relative">
        <PanelList />
      </SidebarInset>
    </SidebarProvider>
  )
}

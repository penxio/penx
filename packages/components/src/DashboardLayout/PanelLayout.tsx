'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { nextTick } from 'process'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useQuery } from '@tanstack/react-query'
import { editorDefaultValue } from '@penx/constants'
import { useCreations } from '@penx/hooks/useCreations'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@penx/uikit/sidebar'
import { uniqueId } from '@penx/unique-id'
import { AppSidebar } from '../Sidebar/app-sidebar'
import { PanelList } from './PanelList'

export function PanelLayout({ children }: { children: ReactNode }) {
  // useSiteTags()
  return (
    <SidebarProvider className="">
      <AppSidebar className="z-2" />
      <SidebarInset className="z-2 relative">
        <PanelList />
      </SidebarInset>

      <div
        className="z-1 fixed left-[10%] top-[0px] h-[80vh] w-[100vw] opacity-30 dark:opacity-80"
        style={{
          filter: 'blur(150px) saturate(150%)',
          transform: 'translateZ(0)',
          backgroundImage:
            'radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)',
        }}
      ></div>
    </SidebarProvider>
  )
}

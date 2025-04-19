'use client'

import { ReactNode } from 'react'
import { SidebarTrigger } from '@penx/ui/components/sidebar'

export function PanelHeaderWrapper({
  children,
  index,
}: {
  children: ReactNode
  index: number
}) {
  if (index === 0)
    return (
      <div className="flex h-10 shrink-0 items-center gap-1 pl-2 pr-1">
        <SidebarTrigger className="" />
        <div className="flex h-10 flex-1 items-center justify-between">
          {children}
        </div>
      </div>
    )
  return (
    <div className="flex h-10 shrink-0 items-center justify-between pl-3 pr-1">
      {children}
    </div>
  )
}

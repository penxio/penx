'use client'

import { ReactNode } from 'react'
import { isMobileApp } from '@penx/constants'
import { SidebarTrigger } from '@penx/uikit/sidebar'
import { cn } from '@penx/utils'

export function PanelHeaderWrapper({
  children,
  index,
  className,
}: {
  children: ReactNode
  index: number
  className?: string
}) {
  if (isMobileApp!) return null
  if (index === 0)
    return (
      <div
        className={cn(
          'flex h-10 shrink-0 items-center gap-1 pl-2 pr-1',
          className,
        )}
      >
        <SidebarTrigger className="" />
        <div className="flex h-10 flex-1 items-center justify-between">
          {children}
        </div>
      </div>
    )
  return (
    <div
      className={cn(
        'flex h-10 shrink-0 items-center justify-between pl-3 pr-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

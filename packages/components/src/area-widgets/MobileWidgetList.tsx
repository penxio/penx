'use client'

import React from 'react'
import { isMobileApp } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { Widget } from '@penx/types'
import { cn } from '@penx/utils'
import { WidgetItem } from './WidgetItem'

export const MobileWidgetList = () => {
  const { area } = useArea()
  const widgets = (area?.widgets || []) as Widget[]
  return (
    <div className={cn('flex flex-col', !isMobileApp && 'gap-2')}>
      {widgets.map((widget, index) => {
        return (
          <WidgetItem
            key={widget.id}
            index={index}
            id={widget.id}
            widget={widget!}
          />
        )
      })}
    </div>
  )
}

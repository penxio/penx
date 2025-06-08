'use client'

import { isMobileApp } from '@penx/constants'
import { AddWidgetButton } from './AddWidgetButton'
import { MobileWidgetList } from './MobileWidgetList'
import { WidgetList } from './WidgetList'

interface Props {}

export function AreaWidgets({}: Props) {
  return (
    <>
      <div className="space-y-2">
        {isMobileApp && <MobileWidgetList />}
        {!isMobileApp && <WidgetList />}
        {/* {!isMobileApp && } */}
        <div className="flex items-center justify-center gap-2">
          <AddWidgetButton />
        </div>
      </div>
    </>
  )
}

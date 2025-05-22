'use client'

import { Trans } from '@lingui/react'
import { AddCreationButton } from '@penx/components/AddCreationButton'
import { isMobileApp } from '@penx/constants'
import { AddWidgetButton } from './AddWidgetButton'
import { EditWidgetButton } from './EditWidget/EditWidgetButton'
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
          {isMobileApp && <EditWidgetButton />}
        </div>
      </div>
    </>
  )
}

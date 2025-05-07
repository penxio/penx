'use client'

import { Trans } from '@lingui/react'
import { PlusIcon } from 'lucide-react'
import { AddCreationButton } from '@penx/components/AddCreationButton'
import { isMobileApp } from '@penx/constants'
import { useAppLoading } from '@penx/hooks/useAppLoading'
import { useCreations } from '@penx/hooks/useCreations'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { Skeleton } from '@penx/uikit/skeleton'
import { AddWidgetButton } from './AddWidgetButton'
import { EditWidgetButton } from './EditWidgetButton'
import { WidgetList } from './WidgetList'

interface Props {}

export function AreaWidgets({}: Props) {
  return (
    <>
      {!isMobileApp && (
        <div className="mb-1 flex items-center justify-between px-2">
          <div className="text-foreground/50 text-xs">
            <Trans id="Creations"></Trans>
          </div>
          <AddCreationButton></AddCreationButton>
        </div>
      )}
      <div className="space-y-2">
        <WidgetList />
        {isMobileApp && (
          <div className="flex w-full justify-center">
            <EditWidgetButton />
          </div>
        )}
        {!isMobileApp && <AddWidgetButton />}
      </div>
    </>
  )
}

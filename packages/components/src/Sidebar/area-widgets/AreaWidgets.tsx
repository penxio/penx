'use client'

import { AddCreationButton } from '@penx/components/AddCreationButton'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { Skeleton } from '@penx/uikit/ui/skeleton'
import { useAppLoading } from '@penx/hooks/useAppLoading'
import { useAreaCreations } from '@penx/hooks/useAreaCreations'
import { Trans } from '@lingui/react/macro'
import { PlusIcon } from 'lucide-react'
import { AddWidgetButton } from './AddWidgetButton'
import { WidgetList } from './WidgetList'

interface Props {}

export function AreaWidgets({}: Props) {
  const { session } = useSession()

  return (
    <>
      <div className="mb-1 flex items-center justify-between px-2">
        <div className="text-foreground/50 text-xs">
          <Trans>Creations</Trans>
        </div>
        <AddCreationButton></AddCreationButton>
      </div>
      <div className="space-y-2">
        <WidgetList />
        <AddWidgetButton />
      </div>
    </>
  )
}

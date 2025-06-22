'use client'

import { Trans } from '@lingui/react/macro'
import { cn } from '@penx/utils'
import { AddWidgetButton } from './AddWidgetButton'
import { WidgetList } from './WidgetList'

interface Props {
  className?: string
}

export function EditWidget({ className }: Props) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-2xl font-bold">
        <Trans>Edit widget</Trans>
      </div>
      <WidgetList />
      <div className="mt-2 flex justify-center">
        <AddWidgetButton />
      </div>
    </div>
  )
}

'use client'

import { Trans } from '@lingui/react/macro'
import { AddCreationTypeButton } from './AddCreationTypeButton'
import { CreationTypeDialog } from './CreationTypeDialog/CreationTypeDialog'
import { CreationTypeList } from './CreationTypeList'
import { PropDialog } from './PropDialog/PropDialog'

// export const runtime = 'edge'
// export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-8 px-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold">
            <Trans>Creation types</Trans>
          </div>
          <div className="text-foreground/50">
            <Trans>Manage your creation types.</Trans>
          </div>
        </div>
        <AddCreationTypeButton />
      </div>
      <div className="flex-1">
        <CreationTypeDialog />
        <PropDialog />
        <CreationTypeList />
      </div>
    </div>
  )
}

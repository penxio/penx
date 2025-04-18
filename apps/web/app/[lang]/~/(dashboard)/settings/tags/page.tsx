'use client'

import { Trans } from '@lingui/react/macro'
import { TagList } from './TagList'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col justify-between">
        <div className="text-3xl font-bold">
          <Trans>Manage tags</Trans>
        </div>
      </div>
      <TagList />
    </div>
  )
}

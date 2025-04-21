'use client'

import { Trans } from '@lingui/react'
import { AddSubscriberButton } from './AddSubscriberButton'
import { SubscriberList } from './SubscriberList'

// export const runtime = 'edge'
export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="flex flex-col gap-8 p-3 md:p-0">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">
          <Trans id="Subscribers"></Trans>
        </div>
        <AddSubscriberButton />
      </div>

      <SubscriberList />
    </div>
  )
}

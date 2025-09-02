'use client'

import { ClientOnly } from '@/lib/widget'
import { Panel } from '@penx/panel-app/components/Panel/Panel'

export default function Page() {
  return (
    <div>
      <ClientOnly>
        <Panel />
      </ClientOnly>
    </div>
  )
}

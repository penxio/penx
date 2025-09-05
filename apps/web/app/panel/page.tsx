'use client'

import { ClientOnly } from '@/lib/widget'
import { Panel } from '@penx/panel-app/components/Panel/Panel'

export default function Page() {
  return (
    <div className="relative mx-auto mt-40 h-[460px] w-[750px]">
      <Panel />
    </div>
  )
}

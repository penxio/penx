'use client'

import { DeleteSiteCard } from './DeleteSiteCard'
import { DeleteSiteDialog } from './DeleteSiteDialog/DeleteSiteDialog'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-6">
      <DeleteSiteDialog />
      <DeleteSiteCard />
    </div>
  )
}

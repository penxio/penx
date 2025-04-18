'use client'

import { DeletePostsCard } from './DeletePostsCard'
import { ExportCard } from './ExportCard'
import { ImportCard } from './ImportCard'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-6">
      <ImportCard />
      <ExportCard />
      <DeletePostsCard />
    </div>
  )
}

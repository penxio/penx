import { Suspense } from 'react'
import { FullPageDatabase } from '@penx/components/database-ui'

export default function Page() {
  return (
    <Suspense>
      <FullPageDatabase />
    </Suspense>
  )
}

import { Suspense } from 'react'
import { FullPageDatabase } from '@penx/components/database-ui/FullPageDatabase'

export default function Page() {
  return (
    <Suspense>
      <FullPageDatabase />
    </Suspense>
  )
}

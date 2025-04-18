import { Suspense } from 'react'
import { FullPageDatabase } from '@/components/database-ui'

export default function Page() {
  return (
    <Suspense>
      <FullPageDatabase />
    </Suspense>
  )
}

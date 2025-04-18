'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { SyncBox } from './SyncBox/SyncBox'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return <SyncBox />
}

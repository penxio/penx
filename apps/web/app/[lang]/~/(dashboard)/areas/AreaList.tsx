'use client'

import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Image } from '@/components/Image'
import { Skeleton } from '@penx/uikit/ui/skeleton'
import { trpc } from '@penx/trpc-client'
import { AreaItem } from './AreaItem'

export function AreaList() {
  const { data = [], isLoading } = trpc.area.list.useQuery()

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {data.map((item) => (
        <AreaItem key={item.id} area={item} />
      ))}
    </div>
  )
}

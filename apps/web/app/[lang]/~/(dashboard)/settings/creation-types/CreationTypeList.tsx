'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { trpc } from '@/lib/trpc'
import { CreationTypeItem } from './CreationTypeItem'

export function CreationTypeList() {
  const { data } = trpc.mold.list.useQuery()

  if (!data) {
    return (
      <div>
        <LoadingDots />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {data.map((item) => (
        <CreationTypeItem key={item.id} mold={item} />
      ))}
    </div>
  )
}

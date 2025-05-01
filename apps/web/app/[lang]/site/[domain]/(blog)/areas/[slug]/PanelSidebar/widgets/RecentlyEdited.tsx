'use client'

import { useCreations } from '@penx/hooks/useCreations'
import { NoCreationYet } from '../components/NoCreationYet'
import { CreationItem } from '../CreationItem'
import { useIsAllContext } from '../IsAllContext'

export function RecentlyEdited() {
  const isAll = useIsAllContext()
  const { creations: data } = useCreations()

  const creations = [...data]
    .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())
    .slice(0, isAll ? 50 : 5)

  if (!creations.length) return <NoCreationYet />
  return (
    <div className="flex flex-col gap-[1px] px-1 pb-2">
      {creations.map((item) => (
        <CreationItem key={item.id} creation={item} />
      ))}
    </div>
  )
}

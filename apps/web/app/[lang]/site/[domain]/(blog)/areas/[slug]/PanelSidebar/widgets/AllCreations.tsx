'use client'

import { useAreaContext } from '@/components/AreaContext'
import { NoCreationYet } from '../components/NoCreationYet'
import { CreationItem } from '../CreationItem'
import { useIsAllContext } from '../IsAllContext'

export function AllCreations() {
  const isAll = useIsAllContext()
  const field = useAreaContext()
  const creations = isAll ? field.creations : field.creations.slice(0, 5)
  if (!creations.length) return <NoCreationYet />

  return (
    <div className="flex flex-col gap-[1px] px-1 pb-2">
      {creations.map((item) => (
        <CreationItem key={item.id} creation={item} />
      ))}
    </div>
  )
}

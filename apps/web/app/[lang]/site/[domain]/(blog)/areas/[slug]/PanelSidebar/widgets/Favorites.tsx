'use client'

import { useAreaContext } from '@/components/AreaContext'
import { mappedByKey } from '@/lib/shared'
import { NoCreationYet } from '../components/NoCreationYet'
import { CreationItem } from '../CreationItem'
import { useIsAllContext } from '../IsAllContext'

export function Favorites() {
  const isAll = useIsAllContext()
  const field = useAreaContext()

  const favorites = field.favorites || []
  const creationsMap = mappedByKey(field.creations, 'id')
  const creations = favorites.map((id) => creationsMap[id])

  if (!creations.length) return <NoCreationYet />

  return (
    <div className="flex flex-col gap-[1px] px-1 pb-2">
      {creations.map((post) => {
        if (!post) return null
        return <CreationItem key={post.id} creation={post} />
      })}
    </div>
  )
}

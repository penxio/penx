'use client'

import { useAreaContext } from '@penx/components/AreaContext'
import { mappedByKey } from '@penx/utils'
import { NoCreationYet } from '../components/NoCreationYet'
import { CreationItem } from '../CreationItem'
import { useIsAllContext } from '../IsAllContext'

export function Favorites() {
  const isAll = useIsAllContext()
  const area = useAreaContext()

  const favorites = area.favorites || []
  const creationsMap = mappedByKey(area.creations, 'id')
  const creations = favorites.map((id) => creationsMap[id])

  if (!creations.length) return <NoCreationYet />

  return (
    <div className="flex flex-col gap-[1px] px-1 pb-2">
      {creations.map((item) => {
        if (!item) return null
        return <CreationItem key={item.id} creation={item} />
      })}
    </div>
  )
}

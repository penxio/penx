import { useAreaContext } from '@penx/components/AreaContext'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { useAreaCreations } from '@penx/hooks/useAreaCreations'
import { mappedByKey } from '@penx/utils'
import { NoCreationYet } from '../components/NoCreationYet'
import { CreationItem } from '../CreationItem'
import { useIsAllContext } from '../IsAllContext'

export function Favorites() {
  const isAll = useIsAllContext()
  const field = useAreaContext()
  const data = useAreaCreationsContext()

  const favorites = field.favorites || []
  const postsMap = mappedByKey(data, 'id')

  const creations = favorites.map((id) => postsMap[id])

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

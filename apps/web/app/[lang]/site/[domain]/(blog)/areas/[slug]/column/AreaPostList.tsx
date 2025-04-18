import { AreaWithCreations } from '@/lib/theme.types'
import { PostItem } from './PostItem'

interface Props {
  area: AreaWithCreations
}
export function AreaPostList({ area }: Props) {
  return (
    <div>
      {area.creations.map((post) => (
        <PostItem key={post.id} area={area} creation={post} />
      ))}
    </div>
  )
}

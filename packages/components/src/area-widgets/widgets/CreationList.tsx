import { useCreations } from '@penx/hooks/useCreations'
import { Widget } from '@penx/types'
import { NoCreationYet } from '../components/NoCreationYet'
import { CreationItem } from '../CreationItem'
import { useIsAllContext } from '../IsAllContext'

interface Props {
  widget: Widget
}
export function CreationList({ widget }: Props) {
  const { isAll } = useIsAllContext()
  const { creations: data } = useCreations()

  let posts = [...data]
    .filter((post) => post.moldId === widget.moldId)
    .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())

  if (!isAll) {
    posts = posts.slice(0, 5)
  }

  if (!posts.length) return <NoCreationYet />
  return (
    <div className="flex flex-col gap-[1px] px-1 pb-2">
      {posts.map((post) => (
        <CreationItem key={post.id} creation={post} />
      ))}
    </div>
  )
}

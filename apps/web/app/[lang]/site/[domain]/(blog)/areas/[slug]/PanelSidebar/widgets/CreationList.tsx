'use client'

import { useAreaContext } from '@/components/AreaContext'
import { Widget } from '@/lib/types'
import { NoCreationYet } from '../components/NoCreationYet'
import { CreationItem } from '../CreationItem'
import { useIsAllContext } from '../IsAllContext'

interface Props {
  widget: Widget
}
export function CreationList({ widget }: Props) {
  const isAll = useIsAllContext()
  const field = useAreaContext()

  let creations = field.creations
    .filter((post) => post.moldId === widget.moldId)
    .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())

  if (!isAll) {
    creations = creations.slice(0, 5)
  }

  if (!creations.length) return <NoCreationYet />
  return (
    <div className="flex flex-col gap-[1px] px-1 pb-2">
      {creations.map((post) => (
        <CreationItem key={post.id} creation={post} />
      ))}
    </div>
  )
}

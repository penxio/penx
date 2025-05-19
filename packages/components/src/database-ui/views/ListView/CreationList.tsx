'use client'

import { Struct } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { Panel } from '@penx/types'
import { CreationItem } from './CreationItem'

interface PostListProps {
  struct: Struct
}

export function CreationList(props: PostListProps) {
  const { creations: data } = useCreations()
  const creations = data.filter((item) => item.structId === props?.struct?.id)

  return (
    <div className="grid gap-0.5 px-3 pt-3">
      {creations.map((item) => {
        return <CreationItem key={item.id} creation={item} className="h-8" />
      })}
    </div>
  )
}

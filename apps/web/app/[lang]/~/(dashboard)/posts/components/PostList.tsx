'use client'

import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import { useSiteContext } from '@/components/SiteContext'
import { CreationStatus } from '@/lib/constants'
import { PostItem } from './PostItem'

interface PostListProps {
  status: CreationStatus
}

export function PostList({ status }: PostListProps) {
  const data = useAreaCreationsContext()

  const { id } = useSiteContext()

  const creations = data.filter((item) => {
    if (status === CreationStatus.DRAFT) {
      return (
        item.status === status || item.status === CreationStatus.CONTRIBUTED
      )
    }
    return item.status === status
  })

  if (!creations.length) {
    return <div className="text-foreground/60">No creations yet.</div>
  }

  return (
    <div className="grid gap-4">
      {creations.map((item) => {
        return <PostItem key={item.id} creation={item as any} status={status} />
      })}
    </div>
  )
}

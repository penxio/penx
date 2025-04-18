'use client'

import { useSiteContext } from '@/components/SiteContext'
import { CreationStatus } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { PostItem } from './PostItem'

interface PostListProps {}

export function PostList({}: PostListProps) {
  const { data: creations = [], isLoading } =
    trpc.creation.archivedCreations.useQuery()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!creations.length) {
    return <div className="text-foreground/60">No archived yet.</div>
  }

  return (
    <div className="grid gap-4">
      {creations.map((post) => {
        return <PostItem key={post.id} creation={post} />
      })}
    </div>
  )
}

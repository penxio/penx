'use client'

import { useState } from 'react'
import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import { useSiteContext } from '@/components/SiteContext'
import { Label } from '@penx/ui/components/label'
import { Switch } from '@penx/ui/components/switch'
import { useAreaCreations } from '@/hooks/useAreaCreations'
import { CreationStatus } from '@/lib/constants'
import { PostItem } from './PostItem'

interface PostListProps {}

export function PostList({}: PostListProps) {
  const [published, setPublished] = useState(false)
  const data = useAreaCreationsContext()
  const { id } = useSiteContext()

  const creations = data.filter((item) =>
    published ? item.status === CreationStatus.PUBLISHED : true,
  )

  if (!creations.length) {
    return <div className="text-foreground/60">No creations yet.</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end gap-1">
        <Switch
          id="only-published"
          checked={published}
          onCheckedChange={(checked) => {
            setPublished(checked)
          }}
        />
        <Label htmlFor="only-published">Only published</Label>
      </div>

      <div className="columns-2 gap-x-6 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5">
        {creations.map((post) => {
          return <PostItem key={post.id} creation={post as any} />
        })}
      </div>
    </div>
  )
}

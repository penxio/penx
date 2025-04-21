'use client'

import { useState } from 'react'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Label } from '@penx/uikit/ui/label'
import { Switch } from '@penx/uikit/ui/switch'
import { CreationStatus } from '@penx/constants'
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
    <div>
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
      <div className="grid gap-4">
        {creations.map((post) => {
          return <PostItem key={post.id} creation={post as any} />
        })}
      </div>
    </div>
  )
}

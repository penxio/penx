'use client'

import { useState } from 'react'
import { useAreaCreationsContext } from '@/components/AreaCreationsContext'
import { useSiteContext } from '@/components/SiteContext'
import { Label } from '@penx/uikit/ui/label'
import { Switch } from '@penx/uikit/ui/switch'
import { useAreaCreations } from '@/hooks/useAreaCreations'
import { CreationStatus } from '@penx/constants'
import { Panel } from '@/lib/types'
import { Mold } from '@prisma/client'
import { ArticleItem } from './ArticleItem'

interface PostListProps {
  mold: Mold
  panel: Panel
  index: number
}

export function ArticleList(props: PostListProps) {
  const data = useAreaCreationsContext()
  const creations = data.filter((item) => item.moldId === props.mold.id)

  return (
    <div className="grid gap-4">
      {creations.map((item) => {
        return <ArticleItem key={item.id} creation={item as any} />
      })}
    </div>
  )
}

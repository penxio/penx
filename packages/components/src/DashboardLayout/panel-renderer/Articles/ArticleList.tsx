'use client'

import { useState } from 'react'
import { useAreaCreationsContext } from '@penx/components/AreaCreationsContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Label } from '@penx/uikit/ui/label'
import { Switch } from '@penx/uikit/ui/switch'
import { useAreaCreations } from '@penx/hooks/useAreaCreations'
import { CreationStatus } from '@penx/constants'
import { Panel } from '@penx/types'
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

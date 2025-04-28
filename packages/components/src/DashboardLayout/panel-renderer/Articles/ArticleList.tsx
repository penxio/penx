'use client'

import { useState } from 'react'
import { Mold } from '@penx/db/client'
import { CreationStatus } from '@penx/constants'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useCreations } from '@penx/hooks/useCreations'
import { Panel } from '@penx/types'
import { Label } from '@penx/uikit/label'
import { Switch } from '@penx/uikit/switch'
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
        return <ArticleItem key={item.id} creation={item} />
      })}
    </div>
  )
}

'use client'

import { HashIcon } from 'lucide-react'
import { Creation } from '@penx/domain'
import { useCreationTags } from '@penx/hooks/useCreationTags'
import { useTags } from '@penx/hooks/useTags'
import { getTextColorByName } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'

interface Props {
  creation: Creation
}

export function Tags({ creation }: Props) {
  const { queryByCreation } = useCreationTags()
  const { tags } = useTags()
  const creationTags = queryByCreation(creation.id)

  return (
    <div className="flex items-center gap-2">
      {creationTags.map((item) => {
        const tag = tags.find((t) => t.id === item.tagId)!
        if (!tag) return null
        return (
          <div
            key={item.id}
            className={cn(
              'group relative flex items-center gap-0.5 rounded-full text-xs',
              getTextColorByName(tag.color),
            )}
          >
            <HashIcon size={12} className="inline-flex group-hover:hidden" />
            <div>{tag.name}</div>
          </div>
        )
      })}
    </div>
  )
}

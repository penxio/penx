'use client'

import { Struct } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { useMySpace } from '@penx/hooks/useMySpace'
import { useTags } from '@penx/hooks/useTags'
import { getTextColorByName } from '@penx/libs/color-helper'
import { Panel } from '@penx/types'
import { cn } from '@penx/utils'
import { BookmarkItem } from './BookmarkItem'

interface Props {
  struct: Struct
  panel: Panel
  index: number
}

export function BookmarkList(props: Props) {
  const { creations: data } = useCreations()
  const { tags } = useTags()
  const creations = data.filter((item) => item.structId === props.struct.id)

  return (
    <div className="flex w-full flex-col gap-2">
      {tags.map((tag) => {
        // const tagCreations = creations.filter((item) => {
        //   return item.creationTags.some((t) => t.tagId === tag.id)
        // })

        // if (!tagCreations.length) return null

        return (
          <div key={tag.id} className="mb-6 py-2">
            <div
              className={cn('mb-2 font-bold', getTextColorByName(tag.color))}
            >
              {tag.name}
            </div>
            <div className="">
              {/* {tagCreations.map((post) => {
                return (
                  <BookmarkItem
                    key={post.id}
                    creation={post as any}
                    {...props}
                  />
                )
              })} */}
            </div>
          </div>
        )
      })}
    </div>
  )
}

'use client'

import { Link } from '@penx/libs/i18n'
import { Tag as TagEntity } from '@penx/types'
import { slug } from 'github-slugger'

interface Props {
  tags: TagEntity[]
}

export function TagNav({ tags }: Props) {
  return (
    <div className="flex items-center justify-center gap-4 text-lg">
      <div>All</div>
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/tags/${slug(tag.name)}`}
          className="text-foreground/70 hover:text-foreground cursor-pointer"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}

'use client'

import { slug } from 'github-slugger'
import { Link, usePathname } from '@penx/libs/i18n'
import { Tag } from '@penx/types'

interface PostListWithTagProps {
  tags: Tag[]
}

export function TagList({ tags = [] }: PostListWithTagProps) {
  const pathname = usePathname()!

  return (
    <div className="">
      <ul className="flex flex-wrap gap-x-5">
        {tags.map((t) => {
          return (
            <li key={t.id} className="my-3">
              {decodeURI(pathname.split('/tags/')[1]) === slug(t.name) ? (
                <h3 className="text-brand inline py-2">#{`${t.name}`}</h3>
              ) : (
                <Link
                  href={`/tags/${slug(t.name)}`}
                  className="text-foreground/60 hover:text-brand dark:hover:text-brand rounded-full py-2"
                  aria-label={`View posts tagged ${t.name}`}
                >
                  #{`${t.name}`}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

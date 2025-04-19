'use client'

import { Link, usePathname } from '@/lib/i18n'
import { Tag } from '@penx/types'
import { cn } from '@penx/utils'
import { slug } from 'github-slugger'

interface PostListWithTagProps {
  tags: Tag[]
}

export function TagList({ tags = [] }: PostListWithTagProps) {
  const pathname = usePathname()!

  return (
    <ul className="flex w-full flex-wrap justify-center gap-x-1">
      <li className="my-3">
        <Link
          href="/"
          className={cn(
            'text-foreground/60 hover:bg-foreground/6 rounded-full px-4 py-2',
            pathname === '/' && 'text-foreground bg-foreground/6',
          )}
        >
          All
        </Link>
      </li>

      {tags.map((t) => {
        return (
          <li key={t.id} className="my-3">
            <Link
              href={`/tags/${slug(t.name)}`}
              className={cn(
                'text-foreground/60 hover:bg-foreground/6 rounded-full px-4 py-2',
                decodeURI(pathname.split('/tags/')[1]) === slug(t.name) &&
                  'text-foreground bg-foreground/6 px-4 py-2',
              )}
              aria-label={`View posts tagged ${t.name}`}
            >
              {`${t.name}`}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

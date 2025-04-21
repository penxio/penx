import { ContentRender } from '@penx/content-render'
import { Link } from '@penx/libs/i18n'
import { Creation, Site } from '@penx/types'
import { cn, formatDate } from '@penx/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import { getUserName } from '../lib/getUserName'
import { AuthorAvatar } from './AuthorAvatar'

interface Props {
  creations: Creation[]
}

export const MostPopular = ({ creations }: Props) => {
  return (
    <div className="space-y-4">
      <div className="text-xl font-medium">Most Popular</div>
      <div className="grid gap-5">
        {creations.slice(0, 5).map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex flex-col gap-2">
              <Link
                href={`/creations/${post.slug}`}
                key={post.slug}
                className="text-foreground/80 hover:text-foreground text-base font-bold leading-tight"
              >
                {post.title}
              </Link>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <AuthorAvatar creation={post} className="h-5 w-5" />
                  <div className="font-medium">
                    {getUserName(post.authors?.[0]?.user)}
                  </div>
                </div>
                <time className="text-foreground/50 text-xs">
                  {/* {format(new Date(post.updatedAt), 'MM/dd')} */}
                  {formatDate(post.updatedAt)}
                </time>
              </div>
            </div>

            {post.image && (
              <div className="max-w-[80px] justify-between">
                <Link href={`/creations/${post.slug}`}>
                  <Image
                    src={post.image || ''}
                    className="h-auto w-full rounded"
                    style={{
                      aspectRatio: '1.5/1',
                    }}
                    width={400}
                    height={400}
                    alt=""
                  />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

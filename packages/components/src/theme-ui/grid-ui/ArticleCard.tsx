'use client'

import { Trans } from '@lingui/react'
import { format } from 'date-fns'
import { Image } from '@penx/components/Image'
import { CardStyle } from '@penx/constants'
import { ContentRender } from '@penx/content-render'
import { Link } from '@penx/libs/i18n'
import { Creation, LayoutItem, Site } from '@penx/types'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@penx/uikit/hover-card'
import { cn, getUrl } from '@penx/utils'

interface Props {
  site: Site
  item: LayoutItem
  creations: Creation[]
}
export function ArticleCard({ site, item, creations }: Props) {
  const cardStyle = item?.cardStyle || CardStyle.SHADOW
  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={cn(
          'flex items-center justify-between px-4 pt-4',
          cardStyle === CardStyle.UNSTYLED && 'px-0',
        )}
      >
        <div className="text-xl font-bold">
          <Trans id="Writings"></Trans>
        </div>
        <Link
          href="/posts"
          className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
        >
          <Trans id="All"></Trans> &rarr;
        </Link>
      </div>
      <div
        className={cn(
          'flex flex-1 flex-col gap-2 overflow-auto p-4',
          cardStyle === CardStyle.UNSTYLED && 'px-0',
        )}
      >
        {creations.map((post) => {
          const imageUrl = post.image
          return (
            <div key={post.id} className="flex justify-between">
              <div className="space-y-0.5">
                <ArticleTitle creation={post} />
                <div className="flex items-center gap-3">
                  <div className="text-foreground/60 text-xs">
                    {format(new Date(post.publishedAt!), 'yyyy-MM-dd')}
                  </div>
                  <div className="flex items-center gap-1">
                    {post.creationTags.map((item) => (
                      <div key={item.id} className="text-brand text-xs">
                        #{item.tag.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {imageUrl && (
                <Image
                  alt=""
                  width={200}
                  height={200}
                  className="w-18 h-12 rounded-md object-cover"
                  src={getUrl(imageUrl)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ArticleTitle({ creation }: { creation: Creation }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/creations/${creation.slug}`}
          className="hover:text-brand transition-all hover:scale-105"
        >
          {creation.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="max-h-64 w-96 space-y-4 overflow-auto">
        <div className="text-xl font-bold">{creation.title}</div>
        <ContentRender content={creation.content} />
      </HoverCardContent>
    </HoverCard>
  )
}

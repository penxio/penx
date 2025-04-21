import { Trans } from '@lingui/react'
import { format } from 'date-fns'
import { Link } from '@penx/libs/i18n'
import { Creation, Site } from '@penx/types'
import { Badge } from '@penx/uikit/ui/badge'
import { cn } from '@penx/utils'
import { PageTitle } from './PageTitle'
import { PodcastTips } from './PodcastTips'

interface Props {
  site: Site
  creations: Creation[]
  className?: string
}

export function PodcastListWidget({ site, creations, className }: Props) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <PageTitle className="">
        <Trans id="Podcasts"></Trans>
      </PageTitle>

      <div className="grid columns-1 gap-4">
        {creations.map((post) => {
          return <PostItem key={post.id} creation={post as any} />
        })}
      </div>
    </div>
  )
}

interface PostItemProps {
  creation: Creation
}

export function PostItem({ creation }: PostItemProps) {
  return (
    <div className={cn('flex flex-col gap-2')}>
      <Link
        href={`/creations/${creation.slug}`}
        className="flex origin-left items-center gap-1 transition-all hover:scale-105"
      >
        <PodcastTips creation={creation} />
        <div className="hover:text-brand text-lg">{creation.title}</div>
      </Link>

      <div className="flex items-center">
        <div className="flex gap-2">
          {creation.creationTags?.map((item) => (
            <Badge key={item.id} variant="outline">
              {item.tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-foreground/50 text-sm">
            <div>{format(new Date(creation.updatedAt), 'yyyy-MM-dd')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

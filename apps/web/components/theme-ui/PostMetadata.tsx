import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Creation, Site } from '@/lib/theme.types'
import { cn, formatDate, formatUsername, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Separator } from '../ui/separator'
import { UserAvatar } from '../UserAvatar'
import { LangSwitcher } from './LangSwitcher'
import { CommentSheet } from './PostActions/Comment/CommentSheet'

interface Props {
  className?: string
  site: Site
  creation: Creation
}

export function PostMetadata({ site, creation, className }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {creation.authors.map((item, index) => (
            <UserAvatar
              key={item.id}
              address={item.user.displayName}
              className={cn('ring-background ring-2', index > 0 && '-ml-3')}
              image={getUrl(item.user.image || '')}
            ></UserAvatar>
          ))}
        </div>
        <div className="leading-none">
          <div className="flex items-center">
            {creation.authors.map((item, index) => (
              <div key={item.id} className="flex items-center">
                {index > 0 && (
                  <span className="text-foreground/50 mx-1 text-sm">and</span>
                )}
                <span>{formatUsername(item.user.displayName)}</span>
              </div>
            ))}
          </div>
          <dl className="text-foreground/50 flex items-center gap-2 text-sm">
            <dt className="sr-only">
              <Trans>Published on</Trans>
            </dt>
            <dd className="">
              <time>{formatDate(creation.updatedAt)}</time>
            </dd>
            <dd>·</dd>
            <dd className="">{creation.readingTime.text}</dd>
          </dl>
        </div>
        {/* <LangSwitcher site={site} /> */}
      </div>

      <CommentSheet creation={creation} />
    </div>
  )
}

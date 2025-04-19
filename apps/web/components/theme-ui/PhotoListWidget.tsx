import { Creation, Site } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@penx/uikit/ui/badge'
import { ContentRender } from './ContentRender'
import { PageTitle } from './PageTitle'

interface Props {
  site: Site
  creations: Creation[]
  className?: string
}

export function PhotoListWidget({ site, creations, className }: Props) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <PageTitle className="">
        <Trans>Photos</Trans>
      </PageTitle>

      <div className="columns-1 gap-x-6 sm:columns-2 md:columns-2">
        {creations.map((item) => {
          return <PostItem key={item.id} creation={item as any} />
        })}
      </div>
    </div>
  )
}

interface CreationItemProps {
  creation: Creation
}

export function PostItem({ creation }: CreationItemProps) {
  return (
    <div
      className={cn(
        'border-foreground/5 shadow-2xs mb-6 flex break-inside-avoid flex-col gap-2 overflow-hidden rounded-2xl border',
      )}
    >
      <img
        alt={''}
        className="transform brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        // placeholder="blur"
        // blurDataURL={placeholderBlurhash}
        src={getUrl(creation.image || '')}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
      />
    </div>
  )
}

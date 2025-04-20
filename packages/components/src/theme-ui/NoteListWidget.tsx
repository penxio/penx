import { Creation, Site } from '@penx/types'
import { cn } from '@penx/utils'
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

export function NoteListWidget({ site, creations, className }: Props) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <PageTitle className="">
        <Trans>Notes</Trans>
      </PageTitle>

      <div className="columns-1 gap-x-6 sm:columns-2 md:columns-2">
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
    <div
      className={cn(
        'border-foreground/5 shadow-2xs mb-6 flex break-inside-avoid flex-col gap-2 rounded-2xl border px-4 py-2',
      )}
    >
      <ContentRender content={creation.content} />

      <div className="flex items-center justify-between">
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

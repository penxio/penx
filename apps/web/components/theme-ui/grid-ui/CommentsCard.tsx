'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { CardStyle } from '@/lib/constants'
import { LayoutItem, Project, Site } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { cn, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'

interface Props {
  item: LayoutItem
}

export function CommentsCard({ item }: Props) {
  const cardStyle = item?.cardStyle || CardStyle.SHADOW
  const site = useSiteContext()
  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={cn(
          'flex items-center justify-between px-4 pt-4',
          cardStyle === CardStyle.UNSTYLED && 'px-0',
        )}
      >
        <div className="text-xl font-bold">
          <Trans>Latest comments</Trans>
        </div>
      </div>
      <CommentList siteId={site.id} item={item} />
    </div>
  )
}

export function CommentList({
  siteId,
  item,
}: {
  siteId: string
  item: LayoutItem
}) {
  const cardStyle = item?.cardStyle || CardStyle.SHADOW
  const { isLoading, data = [] } = trpc.comment.latestSiteComments.useQuery({
    siteId: siteId,
  })

  if (isLoading) {
    return (
      <div
        className={cn(
          'h-full w-full space-y-1 overflow-auto p-4',
          cardStyle === CardStyle.UNSTYLED && 'px-0 pt-0',
        )}
      >
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-2 overflow-auto px-4 py-4',
        cardStyle === CardStyle.UNSTYLED && 'px-0 pb-4 pt-0',
      )}
    >
      {data.map((comment, index) => (
        <div key={comment.id} className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getUrl(comment.user.image || '')} />
            <AvatarFallback>
              {comment.user.displayName?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="font-semibold">{comment.user.displayName}:</div>
          <div className="text-foreground/80">{comment.content}</div>
        </div>
      ))}
    </div>
  )
}

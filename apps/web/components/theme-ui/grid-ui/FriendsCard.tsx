import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/lib/i18n'
import { Friend, LayoutItem, Project, Site } from '@/lib/theme.types'
import { getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { ArrowUpRight } from 'lucide-react'

export function FriendsCard({
  item,
  friends,
}: {
  item: LayoutItem
  friends: Friend[]
}) {
  // console.log('=====friends:', friends)

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="text-xl font-bold">
          <Trans>Friends</Trans>
        </div>
        <Link
          href="/friends"
          className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
        >
          <Trans>All</Trans> &rarr;
        </Link>
      </div>
      <div className="flex flex-wrap gap-2 overflow-auto px-2">
        {friends.map((item) => (
          <Link
            href={'/friends'}
            key={item.id}
            className="border-foreground/7 hover:bg-foreground/5 inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-2"
          >
            <Avatar className="size-6">
              <AvatarImage src={getUrl(item.avatar || '')} />
              <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Friend } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { SubmitFriendLinkDialog } from './SubmitFriendLinkDialog/SubmitFriendLinkDialog'

interface Props {
  friends: Friend[]
  className?: string
}

export function FriendsBlock({ friends = [], className }: Props) {
  const reviewedFriends = friends.filter(
    (friend) => friend.status === 'approved',
  )
  const pendingFriends = friends.filter((friend) => friend.status === 'pending')

  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <SubmitFriendLinkDialog />
      <div className="space-y-8">
        <FriendList friends={reviewedFriends} />
        {pendingFriends.length > 0 && (
          <div className="space-y-3">
            <Badge variant="secondary">
              <div className="text-sm">Reviewing</div>
            </Badge>
            <FriendList pending friends={pendingFriends} />
          </div>
        )}
      </div>
    </section>
  )
}

function FriendList({
  friends,
  pending = false,
}: Props & { pending?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {friends.map((item, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2',
            pending && 'cursor-not-allowed opacity-45',
          )}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={getUrl(item.avatar || '')} />
            <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          {pending && (
            <div className="flex gap-0.5 font-bold">
              <span>{item.name}</span>
              <ArrowUpRight size={16} className="text-foreground/60" />
            </div>
          )}

          {!pending && (
            <a
              href={item.url}
              target="_blank"
              className="flex gap-0.5 font-bold hover:underline"
            >
              <span>{item.name}</span>
              <ArrowUpRight size={16} className="text-foreground/60" />
            </a>
          )}
          <div className="text-foreground/60 text-sm">{item.introduction}</div>
        </div>
      ))}
    </div>
  )
}

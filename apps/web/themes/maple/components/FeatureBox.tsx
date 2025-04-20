import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { Link } from '@penx/libs/i18n'
import { Creation } from '@penx/types'
import { cn, formatDate, getUrl } from '@penx/utils'
import Image from 'next/image'
import Tag from './Tag'

interface Props {
  creation: Creation
}

export function FeatureBox({ creation }: Props) {
  const user = creation.authors?.[0]?.user
  return (
    <Link
      href={`/creations/${creation.slug}`}
      className={cn('grid w-full grid-cols-3 items-center gap-10')}
    >
      <div className="col-span-2 h-80 overflow-clip rounded-2xl">
        <Image
          src={creation.image || ''}
          alt=""
          width={800}
          height={800}
          className="aspect-16/9 h-auto w-auto object-cover transition-all hover:scale-110"
        />
      </div>

      <div className="col-span-1 w-80 space-y-4">
        <div>
          <div className="flex items-center gap-3 text-sm">
            <div className="text-foreground/50">
              {formatDate(creation.updatedAt)}
            </div>
            <div className="flex flex-wrap">
              {creation.creationTags?.map((item) => (
                <Tag key={item.id} postTag={item} className="text-sm" />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold leading-8 tracking-tight">
            {creation.title}
          </h2>
        </div>
        {user && (
          <div className="flex items-center gap-1">
            <Avatar>
              <AvatarImage src={getUrl(user.image || '')} />
              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                {user.displayName || user.name}
              </div>
              <div>{creation.description}</div>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

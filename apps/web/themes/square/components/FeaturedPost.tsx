import { PodcastTips } from '@/components/theme-ui/PodcastTips'
import { placeholderBlurhash } from '@penx/constants'
import { Link } from '@/lib/i18n'
import { Creation } from '@penx/types'
import { cn, formatDate } from '@penx/utils'
import { MessageCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { Node } from 'slate'
import { getUserName } from '../lib/getUserName'
import { AuthorAvatar } from './AuthorAvatar'

interface Props {
  creation: Creation
}

export default function FeaturedPost({ creation }: Props) {
  const user = creation.authors?.[0]?.user
  const name = getUserName(user)

  const nodes: any[] =
    typeof creation.content === 'string' && creation.content.length
      ? JSON.parse(creation.content)
      : creation.content || []
  const summary = nodes.map((node) => Node.string(node)).join('') || ''
  return (
    <Link
      href={`/creations/${creation.slug}`}
      className="bg-background drop-shadow-xs flex flex-col gap-y-3 overflow-hidden"
    >
      <div className="h-[400px] overflow-clip">
        <Image
          src={creation.image || placeholderBlurhash}
          alt=""
          width={1000}
          height={1000}
          placeholder="blur"
          blurDataURL={placeholderBlurhash}
          className="aspect-16/9 h-auto w-auto object-cover transition-all hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5">
        <div className="space-y-2">
          <div className="flex origin-left items-center gap-1 transition-all hover:scale-105">
            <PodcastTips creation={creation} />
            <h2 className="block text-2xl font-bold">{creation.title}</h2>
          </div>
          <p className="text-foreground/70 hover:text-foreground line-clamp-2 transition-all hover:scale-105">
            {creation.description || summary?.slice(0, 200)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <AuthorAvatar creation={creation} />
            <div className="font-medium">{name}</div>

            <time className="text-foreground/50 ml-2 text-xs">
              {formatDate(creation.updatedAt)}
            </time>
          </div>
          <div className="text-foreground/50 flex items-center gap-1">
            <MessageCircleIcon size={16} className="" />
            {creation.commentCount}
          </div>
        </div>
      </div>
    </Link>
  )
}

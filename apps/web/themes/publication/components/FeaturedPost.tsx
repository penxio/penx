import Image from 'next/image'
import { PostActions } from '@penx/components/PostActions'
import { Link } from '@penx/libs/i18n'
import { Creation } from '@penx/types'
import { cn, formatDate } from '@penx/utils'

interface Props {
  creation: Creation
}

export default function FeaturedPost({ creation }: Props) {
  return (
    <div className="mt-2 flex flex-col gap-y-3">
      <Link href={`/creations/${creation.slug}`}>
        <Image
          src={creation.image || ''}
          className="h-full w-full transition-all hover:scale-105"
          width={1000}
          height={1000}
          alt=""
        />
      </Link>
      <div className="flex items-center justify-between gap-2">
        <h2 className="origin-left text-2xl font-bold transition-all hover:scale-105">
          <Link href={`/creations/${creation.slug}`}>{creation.title}</Link>
        </h2>
        <time className="text-foreground/50 text-sm">
          {formatDate(creation.updatedAt)}
        </time>
      </div>
      <PostActions creation={creation} />
    </div>
  )
}

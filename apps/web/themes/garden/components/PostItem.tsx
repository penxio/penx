import { PlateEditor } from '@/components/editor/plate-editor'
import { PodcastTips } from '@/components/theme-ui/PodcastTips'
import { Link } from '@/lib/i18n'
import { Creation, CreationType } from '@/lib/theme.types'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

interface PostItemProps {
  creation: Creation
}

export function PostItem({ creation }: PostItemProps) {
  const { slug, title } = creation

  const getContent = () => {
    if (creation.type === CreationType.IMAGE) {
      return (
        <div className="flex items-center gap-2">
          <div className="text-base font-bold">
            {creation.title || 'Untitled'}
          </div>
          <Image
            src={creation.content}
            alt=""
            width={100}
            height={100}
            className="h-10 w-10 rounded-lg"
          />
        </div>
      )
    }

    if (creation.type === CreationType.NOTE) {
      return (
        <div className="text-foreground/80">
          <PlateEditor
            value={JSON.parse(creation.content)}
            readonly
            className="px-0 py-0"
          />
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1 transition-all hover:scale-105">
        <PodcastTips creation={creation} />
        <div className="text-lg ">{title}</div>
      </div>
    )
  }

  return (
    <Link
      key={slug}
      href={`/creations/${slug}`}
      className="hover:text-foreground text-foreground/80 flex items-center justify-between gap-6"
    >
      {getContent()}
      <time className="text-foreground/50 text-xs">
        {formatDate(creation.updatedAt)}
      </time>
    </Link>
  )
}

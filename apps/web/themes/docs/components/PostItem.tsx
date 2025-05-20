import Image from 'next/image'
import { PlateEditor } from '@penx/editor/plate-editor'
import { Link } from '@penx/libs/i18n'
import { Creation, StructType } from '@penx/types'
import { formatDate } from '@penx/utils'

interface PostItemProps {
  creation: Creation
}

export function PostItem({ creation }: PostItemProps) {
  const { slug, title } = creation

  const getContent = () => {
    if (creation.type === StructType.IMAGE) {
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

    if (creation.type === StructType.NOTE) {
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

    return <div className="text-lg">{title}</div>
  }

  return (
    <Link
      key={slug}
      href={`/creations/${slug}`}
      className="hover:text-foreground text-foreground/80 flex items-center justify-between gap-6"
    >
      {getContent()}
      <time className="text-foreground/50 text-sm">
        {formatDate(creation.updatedAt)}
      </time>
    </Link>
  )
}

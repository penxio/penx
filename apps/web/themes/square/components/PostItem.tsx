'use client'

import { JSX } from 'react'
import { PlateEditor } from '@/components/editor/plate-editor'
import { PodcastTips } from '@/components/theme-ui/PodcastTips'
import { PostActions } from '@/components/theme-ui/PostActions'
import { placeholderBlurhash } from '@/lib/constants'
import { Link } from '@/lib/i18n'
import { Creation, CreationType, User } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import { MessageCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Node } from 'slate'
import { getUserName } from '../lib/getUserName'
import { AuthorAvatar } from './AuthorAvatar'

interface PostItemProps {
  creation: Creation
  receivers?: string[]
  className?: string
  ContentRender?: (props: { content: any[]; className?: string }) => JSX.Element
}

export function PostItem({
  creation,
  receivers = [],
  className,
}: PostItemProps) {
  const { slug, title } = creation
  const user = creation.authors?.[0]?.user
  const name = getUserName(user)
  const params = useSearchParams()!
  const type = params.get('type')

  if (type === 'photos' && creation.type !== CreationType.IMAGE) return null
  if (type === 'notes' && creation.type !== CreationType.NOTE) return null
  if (type === 'articles' && creation.type !== CreationType.ARTICLE) return null

  const getTitle = () => {
    if (creation.type === CreationType.IMAGE)
      return <div className="">{title}</div>
    if (creation.type === CreationType.NOTE)
      return <div className="">a note</div>
    if (creation.type === CreationType.ARTICLE) {
      return <div className="">an article</div>
    }
    return <div></div>
  }

  const getContent = () => {
    if (creation.type === CreationType.IMAGE) {
      return (
        <img
          src={creation.content}
          alt=""
          className="h-auto w-full rounded-lg"
        />
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

    const nodes: any[] =
      typeof creation.content === 'string' && creation.content.length
        ? JSON.parse(creation.content)
        : creation.content || []
    const str = nodes.map((node) => Node.string(node)).join('') || ''

    return (
      <div className="space-y-2">
        <div className="flex origin-left items-center gap-1 transition-all hover:scale-105">
          <PodcastTips creation={creation} />
          <h2 className="block text-2xl font-bold">{creation.title}</h2>
        </div>
        <p className="text-foreground/70 hover:text-foreground line-clamp-2 transition-all hover:scale-105">
          {creation.description || str?.slice(0, 200)}
        </p>
      </div>
    )
  }

  return (
    <Link
      href={`/creations/${creation.slug}`}
      className={cn(
        'bg-background drop-shadow-xs flex h-48 items-center justify-between overflow-hidden',
        className,
      )}
    >
      <div className="flex-1 cursor-pointer overflow-clip">
        <Image
          src={creation.image || placeholderBlurhash}
          className={cn(
            'aspect-16/9 object-cover transition-all hover:scale-110',
            creation.image && 'h-auto w-auto',
          )}
          placeholder="blur"
          blurDataURL={placeholderBlurhash}
          width={400}
          height={400}
          alt=""
        />
      </div>

      <div className="flex h-full flex-1 flex-col justify-center gap-3 px-5 py-0">
        {getContent()}
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

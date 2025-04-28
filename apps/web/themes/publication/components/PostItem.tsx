'use client'

import { JSX } from 'react'
import { PlateEditor } from '@penx/editor/plate-editor'
import { PodcastTips } from '@penx/components/PodcastTips'
import { PostActions } from '@penx/componentsPostActions/PostActions'
import { Link } from '@penx/libs/i18n'
import { Creation, CreationType, User } from '@penx/types'
import { cn, formatDate } from '@penx/utils'
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

  // console.log('========post:', post)

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
      <Link href={`/creations/${slug}`} className="space-y-2">
        <div className="flex origin-left items-center gap-1 transition-all hover:scale-105">
          <PodcastTips creation={creation} />
          <h2 className="block text-2xl font-bold">{creation.title}</h2>
        </div>
        <p className="text-foreground/70 hover:text-foreground line-clamp-2 transition-all hover:scale-105">
          {creation.description || str?.slice(0, 200)}
        </p>
      </Link>
    )
  }

  return (
    <div className={cn('flex items-center justify-between gap-10', className)}>
      <div className="flex flex-1 flex-col gap-3 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <AuthorAvatar creation={creation} />
            <div className="font-medium">{name}</div>
            <div className="text-foreground/50 text-sm">posted</div>
            {getTitle()}
          </div>
          <time className="text-foreground/50 text-xs">
            {formatDate(creation.updatedAt)}
          </time>
        </div>

        {getContent()}
        <PostActions creation={creation} receivers={receivers} />
      </div>

      {creation.image && (
        <div className="max-w-[160px]">
          <Link href={`/creations/${creation.slug}`}>
            <Image
              src={creation.image || ''}
              className="h-auto w-full rounded"
              style={{
                aspectRatio: '1.5/1',
              }}
              width={400}
              height={400}
              alt=""
            />
          </Link>
        </div>
      )}
    </div>
  )
}

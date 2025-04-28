import { Image } from '@penx/components/Image'
import { PodcastTips } from '@penx/components/PodcastTips'
import { Link } from '@penx/libs/i18n'
import { Creation, CreationType } from '@penx/types'
import { cn, formatDate } from '@penx/utils'
import { Node } from 'slate'
import Tag from './Tag'

interface PostItemProps {
  creation: Creation
}

export function PostItem({ creation }: PostItemProps) {
  const { slug, title } = creation

  function getCardContent() {
    if (creation.type === CreationType.IMAGE) {
      return (
        <Image
          src={creation.content}
          alt=""
          width={400}
          height={400}
          className="h-52 w-full object-cover"
        />
      )
    }

    const getTextFromChildren = (children: any[]) => {
      return children.reduce((acc: string, child: any) => {
        return acc + Node.string(child)
      }, '')
    }

    const text = JSON.parse(creation.content)
      .map((element: any) => {
        if (Array.isArray(element.children)) {
          return getTextFromChildren(element.children)
        } else {
          return Node.string(element)
        }
      })
      .join('')

    if (creation.type === CreationType.NOTE) {
      return (
        <span className="text-foreground/80 border-foreground/5 block h-full border p-4">
          {text}
        </span>
      )
    }

    if (creation?.image) {
      return (
        <Image
          src={creation.image || ''}
          alt=""
          width={400}
          height={400}
          className="h-52 w-full object-cover"
        />
      )
    }

    return (
      <span className="text-foreground/80 border-foreground/5 block h-full border p-4">
        {text}
      </span>
    )
  }

  return (
    <article key={slug} className="flex flex-col space-y-5">
      <Link
        href={`/creations/${slug}`}
        className={cn(
          'h-52 w-full overflow-hidden object-cover transition-all hover:scale-105',
        )}
      >
        {getCardContent()}
      </Link>
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-3 text-sm">
            <div className="text-foreground/50">
              {formatDate(creation.updatedAt)}
            </div>
            <div className="flex flex-wrap">
              {creation.creationTags
                // ?.slice(0, 3)
                ?.map((item) => (
                  <Tag key={item.id} postTag={item} className="text-sm" />
                ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold leading-8 tracking-tight">
            <Link
              href={`/creations/${slug}`}
              className="hover:text-foreground text-foreground/80 transition-colors"
            >
              <div className="flex items-center gap-1 transition-all hover:scale-105">
                <PodcastTips creation={creation} />
                <div className="">{title}</div>
              </div>
            </Link>
          </h2>
        </div>
      </div>
    </article>
  )
}

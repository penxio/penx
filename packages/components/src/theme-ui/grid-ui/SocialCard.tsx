import { ROOT_HOST, SocialType } from '@penx/constants'
import { Link } from '@/lib/i18n'
import { LayoutItem } from '@penx/types'
import { cn, upperFirst } from '@penx/utils'

export function SocialCard({ item }: { item: LayoutItem }) {
  const { url = '' } = (item.props || {}) as Record<string, string>
  const w = item.w

  return (
    <Link
      href={item?.props?.url || ''}
      target="_blank"
      className={cn(
        'flex h-full w-full items-center gap-2 p-4',
        w[0] === 1 && 'flex-col',
      )}
    >
      <img
        alt=""
        src={`${ROOT_HOST}/images/socials/${item.type.toLowerCase()}.webp`}
        className={cn(
          'size-12 rounded-xl shadow-sm transition-all hover:scale-110',
        )}
      />
      <div>
        <div className="text-foreground/50 text-xs">
          {upperFirst(item.type.toLowerCase())}
        </div>
        {url && (
          <div className="text-foreground font-semibold">
            {item.type !== SocialType.DISCORD && <>@{url.split('/').pop()}</>}
          </div>
        )}
      </div>
    </Link>
  )
}

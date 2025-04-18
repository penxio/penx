'use client'

import { ROOT_HOST, SocialType } from '@/lib/constants'
import { LayoutItem } from '@/lib/theme.types'
import { upperFirst } from '@/lib/utils'

interface Props {
  layoutItem: LayoutItem
  layout: LayoutItem[]
}
export function SocialCard({ layoutItem: item }: Props) {
  const { url = '' } = (item.props || {}) as Record<string, string>
  return (
    <div className="flex h-full w-full items-center gap-2 p-4">
      <img
        src={`${ROOT_HOST}/images/socials/${item.type.toLowerCase()}.webp`}
        className="size-12 rounded-xl shadow-sm transition-all hover:scale-110"
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
    </div>
  )
}

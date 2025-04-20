'use client'

import { Link } from '@penx/libs/i18n'
import { AreaWithCreations, Site } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { useParams } from 'next/navigation'

interface Props {
  area: AreaWithCreations
  className?: string
}

export const AboutItem = ({ area }: Props) => {
  const params = useParams() as Record<string, string>
  const creationSlug = params.creationSlug || ''
  const isActive = creationSlug === ''
  return (
    <Link
      href={`/areas/${area.slug}`}
      className={cn(
        'catalogueItem relative mb-[1px] flex items-center justify-between rounded px-2 py-1 transition-colors',
        'hover:bg-foreground/5 cursor-pointer',
        isActive && 'bg-foreground/5',
      )}
    >
      <div className="text-foreground/50 flex h-full flex-1 cursor-pointer items-center gap-x-1">
        <div
          className={cn(
            'text-foreground/70 text-[15px]',
            isActive && 'text-foreground/90',
          )}
        >
          <Trans>About</Trans>
        </div>
      </div>
    </Link>
  )
}

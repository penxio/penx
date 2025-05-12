'use client'

import { CSSProperties, useEffect, useState } from 'react'
import { Trans } from '@lingui/react'
import { useCreationsContext } from '@penx/contexts/CreationsContext'
import { Link } from '@penx/libs/i18n'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  style?: CSSProperties
}

export const BackLinks = ({ className, style = {} }: Props) => {
  const { backLinkCreations: backLinkPosts = [] } = useCreationsContext()
  if (!backLinkPosts.length) return null
  return (
    <div
      className={cn(
        'shrink-0 opacity-60 transition-all hover:opacity-100',
        className,
      )}
      style={{
        ...style,
      }}
    >
      <div className="">
        <h2 className="text-foreground/90 mb-4 text-sm font-semibold">
          <Trans id="Backlinks"></Trans>
        </h2>

        <div className="flex flex-col gap-2">
          {backLinkPosts.map((creation) => {
            return (
              <Link
                key={creation.id}
                href={`/creations/${creation.slug}`}
                className={cn(
                  'text-foreground/40 hover:text-foreground cursor-pointer text-sm transition-all',
                )}
              >
                {creation.title}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

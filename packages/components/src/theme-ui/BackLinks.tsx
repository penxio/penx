'use client'

import { CSSProperties, useEffect, useState } from 'react'
import { Trans } from '@lingui/react'
import { useCreationListContext } from '@penx/contexts/CreationListContext'
import { Link } from '@penx/libs/i18n'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  style?: CSSProperties
}

export const BackLinks = ({ className, style = {} }: Props) => {
  const { backLinkCreations: backLinkPosts = [] } = useCreationListContext()
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
          {backLinkPosts.map((post) => {
            return (
              <Link
                key={post.id}
                href={`/creations/${post.slug}`}
                className={cn(
                  'text-foreground/40 hover:text-foreground cursor-pointer text-sm transition-all',
                )}
              >
                {post.title}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

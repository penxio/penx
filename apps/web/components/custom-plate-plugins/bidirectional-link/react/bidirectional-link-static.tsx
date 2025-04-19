'use client'

import React from 'react'
import { useCreationListContext } from '@/components/CreationListContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@penx/ui/components/hover-card'
import { Link } from '@/lib/i18n'
import { SiteCreation } from '@/lib/types'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { TBidirectionalLinkElement } from '../lib'

export function BidirectionalLinkElementStatic({
  children,
  className,
  prefix,
  ...props
}: SlateElementProps & {
  prefix?: string
}) {
  const element = props.element as TBidirectionalLinkElement
  const { creations: posts } = useCreationListContext()
  const creation = posts.find((p) => p.id === element.creationId)!

  return (
    <SlateElement
      className={cn(
        className,
        'inline-block px-0.5 py-0 align-baseline font-medium transition-all hover:scale-105',
        element.children[0].bold === true && 'font-bold',
        element.children[0].italic === true && 'italic',
        element.children[0].underline === true && 'underline',
      )}
      data-slate-value={element.value}
      {...props}
    >
      {creation && <Content creation={creation as any} />}
      {children}
      {element.value}
    </SlateElement>
  )
}

function Content({ creation }: { creation: SiteCreation }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/creations/${creation.slug}`}
          className="text-brand cursor-pointer"
        >
          {creation?.title || 'Untitled'}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="max-h-64 w-80 space-y-4 overflow-auto">
        <div className="text-xl font-bold">{creation.title}</div>
        <ContentRender content={creation.content} />
      </HoverCardContent>
    </HoverCard>
  )
}

'use client'

import { forwardRef, useMemo } from 'react'
import { Emoji, EmojiStyle } from 'emoji-picker-react'
import { useParams } from 'next/navigation'
import { useAreaContext } from '@penx/components/AreaContext'
import { useMobileSidebarSheet } from '@penx/components/useMobileSidebarSheet'
import { Link } from '@penx/libs/i18n'
import {
  CatalogueNodeJSON,
  CatalogueNodeType,
  ICatalogueNode,
} from '@penx/model'
import { Creation } from '@penx/types'
import { cn } from '@penx/utils'

interface CatalogueItemProps {
  depth: number
  name: string
  item: CatalogueNodeJSON
  creation: Creation
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem(
    { item, name, creation, depth }: CatalogueItemProps,
    ref,
  ) {
    const area = useAreaContext()
    const { setIsOpen } = useMobileSidebarSheet()
    const isCategory = item.type === CatalogueNodeType.CATEGORY
    const params = useParams() as Record<string, string>
    const creationSlug = params.creationSlug || ''
    const isActive = creationSlug === creation?.slug

    const href = useMemo(() => {
      return `/areas/${area.slug}/${creation?.slug}`
    }, [item])

    const linkProps: Record<string, string> = {}
    if (item.type === CatalogueNodeType.LINK && item.uri?.startsWith('http')) {
      linkProps.target = '_blank'
    }

    return (
      <Link
        href={href}
        {...linkProps}
        className={cn(
          'catalogueItem relative mb-[1px] flex items-center justify-between rounded px-2 py-1 transition-colors',
          isCategory && 'mt-6',
          !isCategory && 'hover:bg-foreground/5 cursor-pointer',
          isActive && 'bg-foreground/5',
        )}
        style={
          {
            // paddingLeft: depth * 24 + 6,
          }
        }
        onClick={(e) => {
          setIsOpen?.(false)
          if (isCategory) {
            e.preventDefault()
            console.log('category clicked:', item.id)
          }
        }}
      >
        <div className="text-foreground/50 flex h-full flex-1 cursor-pointer items-center gap-x-1">
          {item.emoji && (
            <Emoji
              unified={item.emoji}
              emojiStyle={EmojiStyle.APPLE}
              size={18}
            />
          )}

          <div
            className={cn(
              'text-foreground/70 text-[15px]',
              isCategory && 'text-foreground text-base font-semibold',
              isActive && 'text-foreground/90',
            )}
          >
            {name || 'Untitled'}
          </div>
        </div>

        {/* {!!item.hasChildren && (
          <div
            className="inline-flex text-foreground/50 hover:bg-foreground/10 rounded justify-center items-center h-5 w-5"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {item.folded && <ChevronRight size={14} />}
            {!item.folded && <ChevronDown size={14} />}
          </div>
        )} */}
      </Link>
    )
  },
)

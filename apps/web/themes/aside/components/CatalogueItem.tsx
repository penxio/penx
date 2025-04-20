'use client'

import { forwardRef, useMemo } from 'react'
import { Link } from '@penx/libs/i18n'
import {
  CatalogueNodeJSON,
  CatalogueNodeType,
  ICatalogueNode,
} from '@penx/model'
import { cn } from '@penx/utils'
import { Emoji, EmojiStyle } from 'emoji-picker-react'

interface CatalogueItemProps {
  depth: number
  name: string
  item: CatalogueNodeJSON
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem({ item, name, depth }: CatalogueItemProps, ref) {
    const isCategory = item.type === CatalogueNodeType.CATEGORY

    const href = useMemo(() => {
      if (item.type === CatalogueNodeType.PAGE) return `/pages/${item.uri}`
      if (item.type === CatalogueNodeType.POST) return `/creations/${item.uri}`
      if (item.type === CatalogueNodeType.LINK) {
        return item.uri || ''
      }
      return `/creations/${item.uri}`
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
          'catalogueItem hover:bg-foreground/5 relative mb-[1px] flex cursor-pointer items-center justify-between rounded px-2 py-1 transition-colors',
          isCategory && 'mt-6',
        )}
        style={
          {
            // paddingLeft: depth * 24 + 6,
          }
        }
        onClick={(e) => {
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
              isCategory && 'text-foreground text-base font-bold',
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

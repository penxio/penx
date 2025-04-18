'use client'

import { forwardRef, useMemo } from 'react'
import { useMobileSidebarSheet } from '@/components/theme-ui/MobileSidebar'
import { Link } from '@/lib/i18n'
import {
  CatalogueNodeJSON,
  CatalogueNodeType,
  ICatalogueNode,
} from '@/lib/model'
import { cn } from '@/lib/utils'
import { Emoji, EmojiStyle } from 'emoji-picker-react'

interface CatalogueItemProps {
  depth: number
  name: string
  item: CatalogueNodeJSON
}

export const CatalogueItem = forwardRef<HTMLDivElement, CatalogueItemProps>(
  function CatalogueItem({ item, name, depth }: CatalogueItemProps, ref) {
    const { setIsOpen } = useMobileSidebarSheet()
    const isCategory = item.type === CatalogueNodeType.CATEGORY

    const href = useMemo(() => {
      if (item.type === CatalogueNodeType.PAGE) return `/docs/${item.uri}`
      if (item.type === CatalogueNodeType.POST) return `/docs/${item.uri}`
      if (item.type === CatalogueNodeType.LINK) {
        return item.uri || ''
      }
      return `/docs/${item.uri}`
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

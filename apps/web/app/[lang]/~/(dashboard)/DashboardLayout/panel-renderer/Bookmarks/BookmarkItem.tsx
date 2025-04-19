'use client'

import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Image } from '@/components/Image'
import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/ui/popover'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@/hooks/useAreaCreations'
import { Creation } from '@/hooks/useCreation'
import { updateMainPanel } from '@/hooks/usePanels'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { Link } from '@/lib/i18n'
import { Prop } from '@penx/types'
import { api } from '@penx/trpc-client'
import { Panel, PanelType } from '@/lib/types'
import { uniqueId } from '@penx/unique-id'
import { cn, getUrl } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  CalendarIcon,
  Edit3Icon,
  ExternalLink,
  MoreHorizontalIcon,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

interface PostItemProps {
  creation: Creation
  panel: Panel
  index: number
}

export function BookmarkItem({ creation }: PostItemProps) {
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any, false)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`

  const url = useMemo(() => {
    const modeProps = creation.mold?.props as Prop[]
    const prop = modeProps.find((p) => p.slug === 'url')!
    if (!prop?.id) return ''
    return creation.props?.[prop.id] || ''
  }, [creation])

  return (
    <div className={cn('flex flex-col gap-2 py-1')}>
      <div className="relative flex items-center justify-between gap-1">
        {isPublished && (
          <div className="bg-brand absolute -left-3 size-[6px] rounded-full"></div>
        )}
        <a
          href={url}
          target="_blank"
          className="hover:text-brand flex flex-1 items-center gap-1"
        >
          {creation.image && (
            <Image
              width={40}
              height={40}
              alt=""
              src={creation.image || ''}
              className="size-5"
            />
          )}
          <div className="line-clamp-1 text-sm">{creation.title}</div>
        </a>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-foreground/60 size-8 shrink-0"
            >
              <MoreHorizontalIcon size={20} />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Button
              size="icon"
              variant="ghost"
              className="size-7 gap-1 rounded-full text-xs opacity-50"
              onClick={() => {
                updateMainPanel({
                  id: uniqueId(),
                  type: PanelType.CREATION,
                  creation: creation as any,
                })
              }}
            >
              <Edit3Icon size={14}></Edit3Icon>
            </Button>

            <ConfirmDialog
              title="Archive this post?"
              content="Are you sure you want to archive this post?"
              tooltipContent="Archive this post"
              onConfirm={async () => {
                await api.creation.archive.mutate(creation.id)
                await refetchAreaCreations()
              }}
            >
              <Button
                size="icon"
                variant="ghost"
                className="size-7 gap-1 rounded-full text-xs opacity-60"
              >
                <Archive size={14}></Archive>
              </Button>
            </ConfirmDialog>
          </PopoverContent>
        </Popover>
      </div>

      {/* {isPublished && (
          <a
            target={isPublished ? '_blank' : '_self'}
            href={
              isPublished
                ? postUrl
                : `/~/post?id=${post.id}&type=${post.mold?.type || ''}`
            }
            className="inline-flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ArrowUpRight size={16} className="text-brand" />
          </a>
        )} */}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import {
  Archive,
  ArrowUpRight,
  CalendarIcon,
  Edit3Icon,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { ConfirmDialog } from '@penx/components/ConfirmDialog'
import { PodcastTips } from '@penx/components/theme-ui/PodcastTips'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@penx/hooks/useAreaCreations'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { api } from '@penx/trpc-client'
import { CreationById, CreationType } from '@penx/types'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface PostItemProps {
  creation: CreationById
}

export function PostItem({ creation }: PostItemProps) {
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any, false)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <a
          target={isPublished ? '_blank' : '_self'}
          href={
            isPublished
              ? postUrl
              : `/~/post?id=${creation.id}&type=${creation.mold?.type || ''}`
          }
          className="inline-flex items-center gap-2 transition-transform hover:scale-105"
        >
          <PodcastTips creation={creation as any} />
          <div className="text-base font-bold">
            {creation.title || 'Untitled'}
          </div>
          {isPublished && creation.type === CreationType.ARTICLE && (
            <ArrowUpRight size={16} className="text-brand" />
          )}
        </a>
      </div>
      <div className="flex gap-2">
        {creation.creationTags?.map((item) => (
          <Badge key={item.id} variant="outline">
            {item.tag.name}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {creation.status !== CreationStatus.PUBLISHED && (
          <div className="text-foreground/50 text-sm">
            <div>{format(new Date(creation.updatedAt), 'yyyy-MM-dd')}</div>
          </div>
        )}
        <Link
          href={`/~/post?id=${creation.id}&type=${creation.mold?.type || ''}`}
        >
          <Button
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
            <div>
              <Trans>Edit</Trans>
            </div>
          </Button>
        </Link>

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
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-60"
          >
            <Archive size={14}></Archive>
            <div>Archive</div>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}

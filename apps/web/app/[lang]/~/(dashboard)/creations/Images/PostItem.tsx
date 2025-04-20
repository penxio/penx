'use client'

import { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PlateEditor } from '@penx/uikit/editor/plate-editor'
import { useSession } from '@penx/session'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/ui/popover'
import { Switch } from '@penx/uikit/ui/switch'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@/hooks/useAreaCreations'
import { Creation } from '@/hooks/useCreation'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { Link } from '@/lib/i18n'
import { CreationType } from '@penx/types'
import { api } from '@penx/trpc-client'
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
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface PostItemProps {
  creation: Creation
}

export function PostItem({ creation }: PostItemProps) {
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any, false)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`

  return (
    <div
      className={cn('mb-6 flex break-inside-avoid flex-col  gap-1 rounded-2xl')}
    >
      <img
        alt={''}
        className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        // placeholder="blur"
        // blurDataURL={placeholderBlurhash}
        src={getUrl(creation.image || '')}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
      />

      <div className="flex gap-2">
        {creation.creationTags?.map((item) => (
          <Badge key={item.id} variant="outline">
            {item.tag.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="text-foreground/50 text-sm">
          <div>{format(new Date(creation.updatedAt), 'yyyy-MM-dd')}</div>
        </div>

        {isPublished && (
          <a
            target={isPublished ? '_blank' : '_self'}
            href={
              isPublished
                ? postUrl
                : `/~/post?id=${creation.id}&type=${creation.mold?.type || ''}`
            }
            className="inline-flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ArrowUpRight size={16} className="text-brand" />
          </a>
        )}
        <Link
          href={`/~/post?id=${creation.id}&type=${creation.mold?.type || ''}`}
        >
          <Button
            size="icon"
            variant="ghost"
            className="size-7 gap-1 rounded-full text-xs opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
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
            size="icon"
            variant="ghost"
            className="size-7 gap-1 rounded-full text-xs opacity-60"
          >
            <Archive size={14}></Archive>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}

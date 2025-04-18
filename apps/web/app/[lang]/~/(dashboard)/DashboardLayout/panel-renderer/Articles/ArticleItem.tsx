'use client'

import { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PlateEditor } from '@/components/editor/plate-editor'
import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@/hooks/useAreaCreations'
import { Creation } from '@/hooks/useCreation'
import { updateMainPanel } from '@/hooks/usePanels'
import { CreationStatus, ROOT_DOMAIN } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { Link } from '@/lib/i18n'
import { CreationType } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { PanelType } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { cn, getUrl } from '@/lib/utils'
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

interface PostItemProps {
  creation: Creation
}

export function ArticleItem({ creation }: PostItemProps) {
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any, false)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <div
          className="inline-flex cursor-pointer items-center gap-2 transition-transform hover:scale-105"
          onClick={() => {
            if (isPublished) {
              window.open(postUrl)
              return
            }
            updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creation: creation as any,
            })
          }}
        >
          <div className="text-base font-bold">
            {creation.title || 'Untitled'}
          </div>
          {isPublished && creation.type === CreationType.ARTICLE && (
            <ArrowUpRight size={16} className="text-brand" />
          )}
        </div>
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
        <Button
          size="xs"
          variant="ghost"
          className="h-7 gap-1 rounded-full text-xs opacity-50"
          onClick={() => {
            updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creation: creation as any,
            })
          }}
        >
          <Edit3Icon size={14}></Edit3Icon>
          <div>
            <Trans>Edit</Trans>
          </div>
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
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-60"
          >
            <Archive size={14}></Archive>
            <div>
              <Trans>Archive</Trans>
            </div>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}

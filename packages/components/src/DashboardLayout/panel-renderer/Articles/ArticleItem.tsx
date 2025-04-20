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
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@penx/hooks/useAreaCreations'
import { updateMainPanel } from '@penx/hooks/usePanels'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { CreationById, CreationType, PanelType } from '@penx/types'
import { PlateEditor } from '@penx/uikit/editor/plate-editor'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { Switch } from '@penx/uikit/ui/switch'
import { uniqueId } from '@penx/unique-id'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface PostItemProps {
  creation: CreationById
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

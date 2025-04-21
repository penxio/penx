'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { format } from 'date-fns'
import {
  Archive,
  CalendarIcon,
  Edit3Icon,
  ExternalLink,
  RedoIcon,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { RouterOutputs } from '@penx/api'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { api, trpc } from '@penx/trpc-client'
import { CreationType } from '@penx/types'
import { PlateEditor } from '@penx/editor/plate-editor'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface PostItemProps {
  creation: RouterOutputs['creation']['archivedCreations']['0']
}

export function PostItem({ creation }: PostItemProps) {
  const { refetch } = trpc.creation.archivedCreations.useQuery()
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any, false)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  function getContent() {
    if (creation.type === CreationType.NOTE) {
      return (
        <div className="flex-1">
          <PlateEditor
            value={JSON.parse(creation.content)}
            readonly
            className="px-0 py-0"
          />
        </div>
      )
    }

    if (
      creation.type === CreationType.IMAGE &&
      creation.content.startsWith('/')
    ) {
      return (
        <div className="flex flex-col gap-1">
          <div className="text-base font-bold">
            {creation.title || 'Untitled'}
          </div>
          <Image
            src={getUrl(creation.content)}
            alt=""
            width={300}
            height={300}
            className="h-64 w-64 rounded-lg"
          />
        </div>
      )
    }

    return (
      <div className="text-base font-bold">{creation.title || 'Untitled'}</div>
    )
  }

  function getCreationType() {
    if (creation.type === CreationType.NOTE) {
      return (
        <Badge variant="secondary" size="sm" className="h-6 text-xs">
          <Trans id="Note"></Trans>
        </Badge>
      )
    }
    return null
  }

  const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <a
          target={isPublished ? '_blank' : '_self'}
          href={isPublished ? postUrl : `/~/post?id=${creation.id}`}
          className="inline-flex items-center gap-2 transition-transform hover:scale-105"
        >
          {getCreationType()}
          {getContent()}
          {isPublished && creation.type === CreationType.ARTICLE && (
            <ExternalLink size={14} className="text-foreground/40" />
          )}
        </a>
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
          onClick={async () => {
            toast.promise(
              async () => {
                await api.creation.restore.mutate(creation.id)
                await refetch()
              },
              {
                loading: <Trans id="Restoring..."></Trans>,
                success: <Trans id="Restored successfully!"></Trans>,
                error: <Trans id="Failed to Restore"></Trans>,
              },
            )
          }}
        >
          <RedoIcon size={14}></RedoIcon>
          <div>
            <Trans id="Restore"></Trans>
          </div>
        </Button>

        <ConfirmDialog
          title={<Trans id="Delete this post?"></Trans>}
          content={<Trans id="Are you sure you want to delete this post?"></Trans>}
          tooltipContent={<Trans id="Delete this post"></Trans>}
          onConfirm={async () => {
            await api.creation.delete.mutate(creation.id)
            await refetch()
          }}
        >
          <Button
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs text-red-500 opacity-60"
          >
            <Trash2 size={14}></Trash2>
            <div>
              <Trans id="Delete"></Trans>
            </div>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}

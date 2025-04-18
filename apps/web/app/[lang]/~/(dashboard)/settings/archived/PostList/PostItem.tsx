'use client'

import { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PlateEditor } from '@/components/editor/plate-editor'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Creation } from '@/hooks/useCreation'
import { CreationStatus, ROOT_DOMAIN } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { Link } from '@/lib/i18n'
import { CreationType } from '@/lib/theme.types'
import { api, trpc } from '@/lib/trpc'
import { cn, getUrl } from '@/lib/utils'
import { RouterOutputs } from '@/server/_app'
import { Trans } from '@lingui/react/macro'
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
          <Trans>Note</Trans>
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
                loading: <Trans>Restoring...</Trans>,
                success: <Trans>Restored successfully!</Trans>,
                error: <Trans>Failed to Restore</Trans>,
              },
            )
          }}
        >
          <RedoIcon size={14}></RedoIcon>
          <div>
            <Trans>Restore</Trans>
          </div>
        </Button>

        <ConfirmDialog
          title={<Trans>Delete this post?</Trans>}
          content={<Trans>Are you sure you want to delete this post?</Trans>}
          tooltipContent={<Trans>Delete this post</Trans>}
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
              <Trans>Delete</Trans>
            </div>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
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
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { PlateEditor } from '@penx/editor/plate-editor'
import { refetchCreations, useCreations } from '@penx/hooks/useCreations'
import { useDomains } from '@penx/hooks/useDomains'
import { useMySite } from '@penx/hooks/useMySite'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { ICreation } from '@penx/model-type/ICreation'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { CreationType, PanelType } from '@penx/types'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Calendar } from '@penx/uikit/calendar'
import { Switch } from '@penx/uikit/switch'
import { uniqueId } from '@penx/unique-id'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface PostItemProps {
  creation: ICreation
}

export function ArticleItem({ creation }: PostItemProps) {
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const { site } = useMySite()
  const { data = [] } = useDomains()
  const { isSubdomain, domain } = getSiteDomain(data, false)
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
            store.panels.updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creationId: creation.id,
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
      {/* <div className="flex gap-2">
        {creation.creationTags?.map((item) => (
          <Badge key={item.id} variant="outline">
            {item.tag.name}
          </Badge>
        ))}
      </div> */}
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
            store.panels.updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creationId: creation.id,
            })
          }}
        >
          <Edit3Icon size={14}></Edit3Icon>
          <div>
            <Trans id="Edit"></Trans>
          </div>
        </Button>

        <ConfirmDialog
          title="Archive this post?"
          content="Are you sure you want to archive this post?"
          tooltipContent="Archive this post"
          onConfirm={async () => {
            await api.creation.archive.mutate(creation.id)
            await refetchCreations()
          }}
        >
          <Button
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-60"
          >
            <Archive size={14}></Archive>
            <div>
              <Trans id="Archive"></Trans>
            </div>
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}

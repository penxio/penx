'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { format } from 'date-fns'
import { produce } from 'immer'
import {
  Archive,
  ArrowUpRight,
  CalendarIcon,
  CheckIcon,
  Edit3Icon,
} from 'lucide-react'
import { Tags } from '@penx/components/Creation/Tags'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { PlateEditor } from '@penx/editor/plate-editor'
import { CreationTagWithTag } from '@penx/hooks/useCreation'
import { refetchCreations } from '@penx/hooks/useCreations'
import { useDomains } from '@penx/hooks/useDomains'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { localDB } from '@penx/local-db'
import { ICreation } from '@penx/model/ICreation'
import { api } from '@penx/trpc-client'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { cn, getUrl } from '@penx/utils'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface PostItemProps {
  creation: ICreation
}

export function NoteItem({ creation: _creation }: PostItemProps) {
  const [creation, setCreation] = useState(_creation)
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { data = [] } = useDomains()
  const { isSubdomain, domain } = getSiteDomain(data)
  const [readonly, setReadonly] = useState(true)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  const creationUrl = `${location.protocol}//${host}/creations/${creation.slug}`
  const [content, setContent] = useState(JSON.parse(creation.content))

  return (
    <div
      className={cn(
        'bg-foreground/3 mb-6 flex break-inside-avoid flex-col rounded-2xl',
        !readonly && 'bg-background shadow-md ring-2',
      )}
    >
      <div className="item-center flex px-3 pt-3">
        <div className="text-foreground/50 text-xs">
          {format(new Date(creation.updatedAt), 'yyyy-MM-dd')}
        </div>
        {isPublished && (
          <a
            target={isPublished ? '_blank' : '_self'}
            href={creationUrl}
            className="inline-flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ArrowUpRight size={16} className="text-brand" />
          </a>
        )}
      </div>

      <PlateEditor
        value={content}
        readonly={readonly}
        variant="note"
        className={cn('w-auto px-3 py-1')}
        onChange={(v) => {
          setContent(v)
        }}
      />
      {/* <div className="flex-col gap-2 px-4 pb-2"></div> */}

      <div className="flex items-center gap-2 px-3 pb-1">
        <Tags creation={creation} />

        <div className="ml-auto">
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
              size="icon"
              variant="ghost"
              className="size-7 gap-1 rounded-full text-xs text-red-500 opacity-60"
            >
              <Archive size={14}></Archive>
            </Button>
          </ConfirmDialog>

          {readonly && (
            <Button
              size="icon"
              variant="ghost"
              className="size-7 gap-1 rounded-full text-xs opacity-50"
              onClick={() => setReadonly(false)}
            >
              <Edit3Icon size={14}></Edit3Icon>
            </Button>
          )}

          {!readonly && (
            <Button
              size="icon"
              variant="ghost"
              className="size-7 gap-1 rounded-full text-xs opacity-50"
              onClick={async () => {
                setReadonly(true)
                await localDB.creation.update(creation.id, {
                  content: JSON.stringify(content),
                })
                await refetchCreations()
                await api.creation.update.mutate({
                  id: creation.id,
                  content: JSON.stringify(content),
                })
              }}
            >
              <CheckIcon size={14}></CheckIcon>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Tags } from '@/components/Creation/Tags'
import { PlateEditor } from '@/components/editor/plate-editor'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@/hooks/useAreaCreations'
import { Creation, CreationTagWithTag } from '@/hooks/useCreation'
import { CreationStatus, ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { api } from '@/lib/trpc'
import { cn, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import { produce } from 'immer'
import {
  Archive,
  ArrowUpRight,
  CalendarIcon,
  CheckIcon,
  Edit3Icon,
} from 'lucide-react'

interface PostItemProps {
  creation: Creation
}

export function NoteItem({ creation: _creation }: PostItemProps) {
  const [creation, setCreation] = useState(_creation)
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any, false)
  const [readonly, setReadonly] = useState(true)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`
  const [content, setContent] = useState(JSON.parse(creation.content))

  return (
    <div
      className={cn(
        'bg-foreground/3 mb-6 flex break-inside-avoid flex-col rounded-2xl',
        !readonly && 'bg-background shadow-md ring-2',
      )}
    >
      <PlateEditor
        value={content}
        readonly={readonly}
        variant="note"
        className={cn('w-auto px-4 py-2')}
        onChange={(v) => {
          setContent(v)
        }}
      />
      <div className="flex-col gap-2 px-4 pb-2">
        <Tags
          creation={creation}
          onDeleteCreationTag={(postTag: CreationTagWithTag) => {
            const newPost = produce(creation, (draft) => {
              draft.creationTags = draft.creationTags.filter(
                (t) => t.id !== postTag.id,
              )
            })
            setCreation(newPost)
          }}
          onAddCreationTag={(postTag: CreationTagWithTag) => {
            const newPost = produce(creation, (draft) => {
              draft.creationTags.push(postTag as any)
            })
            setCreation(newPost)
          }}
        />

        <div className="flex items-center gap-2">
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

          {/* <Link href={`/~/post?id=${post.id}&type=${post.mold?.type || ''}`}></Link> */}
          <div className="ml-auto">
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
                  //
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
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { format } from 'date-fns'
import {
  Archive,
  CalendarIcon,
  Edit3Icon,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { PlateEditor } from '@penx/editor/plate-editor'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@penx/hooks/useAreaCreations'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { CreationById, CreationType } from '@penx/types'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { Switch } from '@penx/uikit/ui/switch'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface PostItemProps {
  status: CreationStatus
  creation: CreationById
}

export function PostItem({ creation, status }: PostItemProps) {
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const [date, setDate] = useState<Date>(creation.publishedAt || new Date())
  const [open, setOpen] = useState(false)
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
          Note
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
        <Link href={`/~/post?id=${creation.id}`}>
          <Button
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
            <div>
              <Trans id="Edit"></Trans>
            </div>
          </Button>
        </Link>

        {status !== CreationStatus.ARCHIVED && (
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
                <Trans id="Archive"></Trans>
              </div>
            </Button>
          </ConfirmDialog>
        )}

        {status === CreationStatus.ARCHIVED && (
          <ConfirmDialog
            title="Delete this post?"
            content="Are you sure you want to delete this post?"
            tooltipContent="Delete this post"
            onConfirm={async () => {
              await api.creation.delete.mutate(creation.id)
              await refetchAreaCreations()
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
        )}
        {status === CreationStatus.PUBLISHED && (
          <div className="text-foreground/50 flex gap-6 text-xs">
            <div className="flex items-center gap-1">
              <Switch
                size="sm"
                defaultChecked={creation.featured}
                onCheckedChange={async (value) => {
                  try {
                    await api.creation.updatePublishedPost.mutate({
                      creationId: creation.id,
                      featured: value,
                    })
                    toast.success('Update successfully!')
                  } catch (error) {
                    toast.error(extractErrorMessage(error))
                  }
                }}
              />
              <div>
                <Trans id="Featured"></Trans>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Switch
                size="sm"
                defaultChecked={creation.isPopular}
                onCheckedChange={async (value) => {
                  try {
                    await api.creation.updatePublishedPost.mutate({
                      creationId: creation.id,
                      isPopular: value,
                    })
                    toast.success('Update successfully!')
                  } catch (error) {
                    toast.error(extractErrorMessage(error))
                  }
                }}
              />
              <div>Popular</div>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'flex h-8 justify-start gap-1 rounded-md px-2 text-xs',
                    !date && 'text-muted-foreground',
                  )}
                  onClick={() => setOpen(!open)}
                >
                  <CalendarIcon size={14} />
                  {date ? (
                    <span>{format(date, 'PPP')}</span>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={async (d) => {
                    setOpen(false)

                    if (d) {
                      setDate(d!)
                      try {
                        await api.creation.updatePublishedPost.mutate({
                          creationId: creation.id,
                          publishedAt: d,
                        })
                        toast.success('Update publish date successfully!')
                      } catch (error) {
                        toast.error(extractErrorMessage(error))
                      }
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  )
}

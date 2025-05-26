'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  CalendarIcon,
  Edit3Icon,
  ExternalLink,
  MoreHorizontalIcon,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Image } from '@penx/components/Image'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { Creation } from '@penx/domain'
import { useCreationStruct } from '@penx/hooks/useCreationStruct'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { Panel, PanelType } from '@penx/types'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Calendar } from '@penx/uikit/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { uniqueId } from '@penx/unique-id'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface Props {
  creation: Creation
  panel: Panel
  index: number
}

export function BookmarkItem({ creation }: Props) {
  // const isPublished = creation.status === CreationStatus.PUBLISHED
  // const { data = [] } = useDomains()
  // const { isSubdomain, domain } = getSiteDomain(data, false)
  // const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain

  // const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`

  // const struct = useCreationStruct(creation)
  // const url = useMemo(() => {
  //   return ''
  // }, [creation, struct])

  // return (
  //   <div className={cn('flex flex-col gap-2 py-1')}>
  //     <div className="relative flex items-center justify-between gap-1">
  //       {isPublished && (
  //         <div className="bg-brand absolute -left-3 size-[6px] rounded-full"></div>
  //       )}
  //       <a
  //         href={url}
  //         target="_blank"
  //         className="hover:text-brand flex flex-1 items-center gap-1"
  //       >
  //         {creation.image && (
  //           <Image
  //             width={40}
  //             height={40}
  //             alt=""
  //             src={creation.image || ''}
  //             className="size-5"
  //           />
  //         )}
  //         <div className="line-clamp-1 text-sm">{creation.title}</div>
  //       </a>

  //       <Popover>
  //         <PopoverTrigger asChild>
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="text-foreground/60 size-8 shrink-0"
  //           >
  //             <MoreHorizontalIcon size={20} />
  //           </Button>
  //         </PopoverTrigger>

  //         <PopoverContent className="w-auto p-0" align="start">
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="size-7 gap-1 rounded-full text-xs opacity-50"
  //             onClick={() => {
  //               store.panels.updateMainPanel({
  //                 id: uniqueId(),
  //                 type: PanelType.CREATION,
  //                 creationId: creation.id,
  //               })
  //             }}
  //           >
  //             <Edit3Icon size={14}></Edit3Icon>
  //           </Button>

  //           <ConfirmDialog
  //             title="Archive this post?"
  //             content="Are you sure you want to archive this post?"
  //             tooltipContent="Archive this post"
  //             onConfirm={async () => {
  //               // await api.creation.archive.mutate(creation.id)
  //               // await store.creations.refetchCreations()
  //             }}
  //           >
  //             <Button
  //               size="icon"
  //               variant="ghost"
  //               className="size-7 gap-1 rounded-full text-xs opacity-60"
  //             >
  //               <Archive size={14}></Archive>
  //             </Button>
  //           </ConfirmDialog>
  //         </PopoverContent>
  //       </Popover>
  //     </div>

  //     {/* {isPublished && (
  //         <a
  //           target={isPublished ? '_blank' : '_self'}
  //           href={
  //             isPublished
  //               ? postUrl
  //               : `/~/post?id=${post.id}&type=${post.struct?.type || ''}`
  //           }
  //           className="inline-flex items-center gap-2 transition-transform hover:scale-105"
  //         >
  //           <ArrowUpRight size={16} className="text-brand" />
  //         </a>
  //       )} */}
  //   </div>
  // )
  return null
}

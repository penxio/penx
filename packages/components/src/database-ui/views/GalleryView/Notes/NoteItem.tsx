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
import { Tags } from '@penx/components/Tags'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { ContentRender } from '@penx/content-render'
import { Creation } from '@penx/domain'
import { useMySite } from '@penx/hooks/useMySite'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { localDB } from '@penx/local-db'
import { NovelEditor } from '@penx/novel-editor/NovelEditor'
import { store } from '@penx/store'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { cn, getUrl } from '@penx/utils'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface PostItemProps {
  creation: Creation
}

export function NoteItem({ creation: _creation }: PostItemProps) {
  // const [creation, setCreation] = useState(_creation)
  // const isPublished = creation.status === CreationStatus.PUBLISHED
  // const { data = [] } = useDomains()
  // const { isSubdomain, domain } = getSiteDomain(data)
  // const [readonly, setReadonly] = useState(true)
  // const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  // const creationUrl = `${location.protocol}//${host}/creations/${creation.slug}`
  // const [content, setContent] = useState(JSON.parse(creation.content))

  // return (
  //   <div
  //     className={cn(
  //       'bg-foreground/3 mb-6 flex break-inside-avoid flex-col rounded-2xl',
  //       !readonly && 'bg-background shadow-md ring-2',
  //     )}
  //   >
  //     <div className="item-center flex px-3 pt-3">
  //       <div className="text-foreground/50 text-xs">
  //         {format(new Date(creation.updatedAt), 'yyyy-MM-dd')}
  //       </div>
  //       {isPublished && (
  //         <a
  //           target={isPublished ? '_blank' : '_self'}
  //           href={creationUrl}
  //           className="inline-flex items-center gap-2 transition-transform hover:scale-105"
  //         >
  //           <ArrowUpRight size={16} className="text-brand" />
  //         </a>
  //       )}
  //     </div>

  //     {readonly && <ContentRender className="px-3 text-sm" content={content} />}
  //     {!readonly && (
  //       <NovelEditor
  //         value={content}
  //         className={cn('w-auto px-3 py-1')}
  //         onChange={(v) => {
  //           setContent(v)
  //         }}
  //       />
  //     )}
  //     {/* <div className="flex-col gap-2 px-4 pb-2"></div> */}

  //     <div className="flex items-center gap-2 px-3 pb-1">
  //       <Tags creation={creation} />

  //       <div className="ml-auto">
  //         <ConfirmDialog
  //           title="Archive this post?"
  //           content="Are you sure you want to archive this post?"
  //           tooltipContent="Archive this post"
  //           onConfirm={async () => {
  //             // await api.creation.archive.mutate(creation.id)
  //             // await store.creations.refetchCreations()
  //           }}
  //         >
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="size-7 gap-1 rounded-full text-xs text-red-500 opacity-60"
  //           >
  //             <Archive size={14}></Archive>
  //           </Button>
  //         </ConfirmDialog>

  //         {readonly && (
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="size-7 gap-1 rounded-full text-xs opacity-50"
  //             onClick={() => setReadonly(false)}
  //           >
  //             <Edit3Icon size={14}></Edit3Icon>
  //           </Button>
  //         )}

  //         {!readonly && (
  //           <Button
  //             size="icon"
  //             variant="ghost"
  //             className="size-7 gap-1 rounded-full text-xs opacity-50"
  //             onClick={async () => {
  //               setReadonly(true)
  //               await localDB.updateCreationProps(creation.id, {
  //                 content: JSON.stringify(content),
  //               })
  //               await store.creations.refetchCreations()
  //             }}
  //           >
  //             <CheckIcon size={14}></CheckIcon>
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // )
  return null
}

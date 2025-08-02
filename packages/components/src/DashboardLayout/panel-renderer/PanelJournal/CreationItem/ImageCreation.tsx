'use client'

import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Creation, Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { idb } from '@penx/indexeddb'
import { useSession } from '@penx/session'
import { ColumnType } from '@penx/types'
import { ProgressiveImage } from '@penx/uikit/components/ProgressiveImage'
import { cn } from '@penx/utils'
import { tryToUploadImage } from './lib/tryToUploadImage'

interface Props {
  isDetailPanel?: boolean
  creation: Creation
}

export function ImageCreation({ creation, isDetailPanel = false }: Props) {
  const inited = useRef(false)
  const { session } = useSession()
  useEffect(() => {
    if (!session) return
    // if (session.isPro) {
    // }

    if (inited.current) return
    inited.current = true
    tryToUploadImage(creation)
  }, [creation, session])

  const { isLoading, data: src } = useQuery({
    queryKey: ['creation', 'image', creation.id],
    queryFn: async () => {
      if (creation.data?.fileId) {
        const item = await idb.file.get(creation.data.fileId)
        if (item) return URL.createObjectURL(item.file)
      }
      return creation.imageUrl
    },
  })

  if (isLoading) {
    return <div className="bg-foreground/6 size-9 rounded-lg"></div>
  }

  return (
    <motion.div
      // layoutId={`photo-${creation.id}`}
      className={cn(
        'overflow-hidden rounded-lg',
        isDetailPanel && 'inline-block w-full break-inside-avoid',
        !isDetailPanel && 'size-9 ',
      )}
    >
      <img
        alt=""
        className="h-full w-full object-cover"
        src={src!}
        // fallbackSrc={creation.imageUrl}
        onClick={(e) => {
          e.stopPropagation()
          appEmitter.emit('ROUTE_TO_CREATION', creation)
        }}
      />
    </motion.div>
  )
}

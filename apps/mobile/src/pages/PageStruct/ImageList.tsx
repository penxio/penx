import React, { useEffect, useMemo, useRef } from 'react'
import { isAndroid } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CloudAlertIcon } from 'lucide-react'
import { tryToUploadImage } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/lib/tryToUploadImage'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { sleep } from '@penx/utils'

interface Props {
  containerWidth: number
  creations: Creation[]
}

export const ImageList = ({ creations, containerWidth }: Props) => {
  const columns = 3
  const parentRef = React.useRef<HTMLDivElement>(null)

  const itemSize = containerWidth / columns || 120 // 避免初始为0
  const rowCount = Math.ceil(creations.length / columns)

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemSize,
    overscan: 5,
  })

  const h = useMemo(() => {
    if (isAndroid) return 'calc(var(--safe-area-inset-top) + 50px)'
    return 'calc(var(--safe-area-inset-top) + 40px)'
  }, [isAndroid])

  return (
    <div
      ref={parentRef}
      className="h-screen w-full"
      style={{
        paddingTop: h,
        width: '100vw',
        overflow: 'auto',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const baseIndex = virtualRow.index * columns
          console.log('=====itemSize:', itemSize)

          return (
            <React.Fragment key={virtualRow.key}>
              {[0, 1, 2].map((col) => {
                const itemIndex = baseIndex + col
                if (itemIndex >= creations.length) return null
                const creation = creations[itemIndex]

                return (
                  <div
                    key={col}
                    className="absolute p-0.5"
                    style={{
                      left: `${itemSize * col}px`,
                      top: 0,
                      width: `${itemSize}px`,
                      height: `${itemSize}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <CreationImage creation={creation} />
                  </div>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

function CreationImage({ creation }: { creation: Creation }) {
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
        const item = await localDB.file.get(creation.data.fileId)
        if (item) return URL.createObjectURL(item.file)
      }
      return creation.imageUrl
    },
    staleTime: 1000 * 60 * 60,
  })

  if (isLoading) {
    return <div className="bg-foreground/6 size-full"></div>
  }

  return (
    <div className="relative inline-flex size-full">
      <img
        alt=""
        className="size-full object-cover"
        src={src!}
        onClick={(e) => {
          // e.stopPropagation()
          // appEmitter.emit('ROUTE_TO_CREATION', creation)
        }}
      />
      {!creation.imageUrl && (
        <div className="bg-foreground/8 absolute right-1 top-1 flex size-5 items-center justify-center rounded-full">
          <CloudAlertIcon size={14} className=" text-yellow-500" />
        </div>
      )}
    </div>
  )
}

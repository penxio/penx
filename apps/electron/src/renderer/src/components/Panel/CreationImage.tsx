import React, { useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CloudAlertIcon } from 'lucide-react'
import { tryToUploadImage } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/lib/tryToUploadImage'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { idb } from '@penx/indexeddb'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'

export function CreationImage({ creation }: { creation: Creation }) {
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
          e.stopPropagation()
          appEmitter.emit('ROUTE_TO_CREATION', creation)
        }}
      />
      {/* {!creation.imageUrl && (
        <div className="bg-foreground/8 absolute right-1 top-1 flex size-5 items-center justify-center rounded-full">
          <CloudAlertIcon size={14} className=" text-yellow-500" />
        </div>
      )} */}
    </div>
  )
}

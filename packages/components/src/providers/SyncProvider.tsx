'use client'

import { useState } from 'react'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useQuery } from '@tanstack/react-query'
import { SHAPE_URL } from '@penx/constants'
import { refetchTags } from '@penx/hooks/useTags'
import { localDB } from '@penx/local-db'
import { ISite } from '@penx/model/ISite'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { isRowsEqual } from './lib/isRowsEqual'
import { syncAreasToLocal } from './lib/syncAreasToLocal'
import { syncCreationsToLocal } from './lib/syncCreationsToLocal'
import { syncCreationTagsToLocal } from './lib/syncCreationTagsToLocal'
import { syncTagsToLocal } from './lib/syncTagsToLocal'

// const worker = new Worker(new URL('./db-worker.ts', import.meta.url), {
//   type: 'module',
// })

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession()
  const { isLoading, data, error } = useQuery({
    queryKey: ['db'],
    queryFn: async () => {
      let site = await localDB.site.get(session.siteId)
      const siteId = session.siteId

      if (!site) {
        const [
          remoteSite,
          remoteAreas,
          remoteMolds,
          remoteTags,
          remoteCreationTags,
        ] = await Promise.all([
          api.site.mySite.query(),
          api.area.listSiteAreas.query({ siteId }),
          api.mold.listBySite.query(),
          api.tag.listSiteTags.query({ siteId }),
          api.tag.listSiteCreationTags.query({ siteId }),
        ])

        await localDB.site.put(remoteSite as any)
        await localDB.area.bulkPut(remoteAreas as any)
        await localDB.mold.bulkPut(remoteMolds as any)
        await localDB.tag.bulkPut(remoteTags as any)
        await localDB.creationTag.bulkPut(remoteCreationTags as any)
      }

      console.log('sync end!!!!!!!!!!!!!!!!!!!!!!')

      syncTagsToLocal(session.siteId)
      syncAreasToLocal(session.siteId)
      syncCreationTagsToLocal(session.siteId)
      await syncCreationsToLocal(session.siteId)

      return [] as string[]
    },
    enabled: !!session,
  })

  if (isLoading || !session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingDots className="bg-foreground/60"></LoadingDots>
      </div>
    )
  }
  if (error) return <div>Error: {error.message}</div>
  return <>{children}</>
}

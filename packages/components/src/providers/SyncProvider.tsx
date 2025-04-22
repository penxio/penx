'use client'

import { Shape, ShapeStream } from '@electric-sql/client'
import { useQuery } from '@tanstack/react-query'
import { SHAPE_URL } from '@penx/constants'
import { refetchTags } from '@penx/hooks/useTags'
import { localDB } from '@penx/local-db'
import { ISite } from '@penx/model/ISite'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
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
      if (!site) {
        const remoteSite = await api.site.mySite.query()
        console.log('========site:', remoteSite)
        await localDB.site.add(remoteSite as any)
        site = remoteSite as any as ISite
      }

      const areas = await localDB.area.where({ siteId: site.id }).toArray()

      if (!areas?.length) {
        const remoteAreas = await api.area.listSiteAreas.query({
          siteId: site.id,
        })
        await localDB.area.bulkPut(remoteAreas as any)
      }

      let molds = await localDB.mold.where({ siteId: site.id }).toArray()

      if (!molds?.length) {
        const remoteMolds = await api.mold.listBySite.query()
        await localDB.mold.bulkPut(remoteMolds as any)
      }

      const tags = await localDB.tag.where({ siteId: site.id }).toArray()

      if (!tags?.length) {
        const remoteTags = await api.tag.listSiteTags.query({
          siteId: site.id,
        })
        await localDB.tag.bulkPut(remoteTags as any)
      }

      const creationTags = await localDB.creationTag
        .where({ siteId: site.id })
        .toArray()

      if (!creationTags?.length) {
        const remoteCreationTags = await api.tag.listSiteCreationTags.query({
          siteId: site.id,
        })
        await localDB.creationTag.bulkPut(remoteCreationTags as any)
      }

      // const creations = await localDB.creation
      //   .where({ siteId: site.id })
      //   .toArray()

      // if (!creations?.length) {
      //   const remoteCreations = await api.creation.listSiteCreations.query({
      //     siteId: site.id,
      //   })
      //   await localDB.creation.bulkPut(remoteCreations as any)
      // }

      syncTagsToLocal(session.siteId)
      syncAreasToLocal(session.siteId)
      syncCreationTagsToLocal(session.siteId)
      await syncCreationsToLocal(session.siteId)

      return [] as string[]
    },
    enabled: !!session,
  })

  if (isLoading) return <div>sync...</div>
  return <>{children}</>
}

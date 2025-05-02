import { get, set } from 'idb-keyval'
import { localDB } from '@penx/local-db'
import { ISite } from '@penx/model-type'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { Panel, PanelType, SessionData, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { initLocalSite } from './lib/initLocalSite'
import { isRowsEqual } from './lib/isRowsEqual'
import { syncAreasToLocal } from './lib/syncAreasToLocal'
import { syncCreationsToLocal } from './lib/syncCreationsToLocal'
import { syncCreationTagsToLocal } from './lib/syncCreationTagsToLocal'
import { syncTagsToLocal } from './lib/syncTagsToLocal'

const PANELS = 'PANELS'

export class AppService {
  inited = false

  async init(session: SessionData) {
    console.log('========session:', session)

    store.app.setAppLoading(true)

    // TODO: handle site empty
    let site = (await localDB.site.toCollection().first())!
    const siteId = site?.id

    if (!site && navigator.onLine && session) {
      const [remoteSite] = await this.syncInitialData(siteId)
      site = remoteSite as ISite
    }

    if (navigator.onLine && session) {
      syncTagsToLocal(session.siteId)
      syncAreasToLocal(session.siteId)
      syncCreationTagsToLocal(session.siteId)
      await syncCreationsToLocal(session.siteId)
    }

    if (!site) {
      await initLocalSite()
      return
    }
    await store.site.save(site)

    const panels = await this.getPanels(site.id)

    const areas = await localDB.area.where({ siteId }).toArray()

    const localVisit = await store.visit.fetch()

    const area =
      areas.find((a) => a.id === localVisit.activeAreaId || a.isGenesis) ||
      areas[0]

    const visit = await store.visit.save({ activeAreaId: area.id })

    const molds = await localDB.mold.where({ siteId }).toArray()
    const tags = await localDB.tag.where({ siteId }).toArray()
    const creationTags = await localDB.creationTag.where({ siteId }).toArray()
    const creations = await localDB.creation
      .where({ areaId: area.id })
      .toArray()

    store.site.set(site)
    store.creations.set(creations)
    store.visit.set(visit)
    store.area.set(area)
    store.areas.set(areas)
    store.molds.set(molds)
    store.tags.set(tags)
    store.creationTags.set(creationTags)
    store.panels.set(panels)
    store.app.setAppLoading(false)
    this.inited = true
  }

  private async syncInitialData(siteId: string) {
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
    return [remoteSite]
  }

  private async getPanels(siteId: string) {
    const key = `${PANELS}_${siteId}`
    const panels: Panel[] = (await get(key)) || []
    if (!panels.length) {
      const defaultPanels = [
        {
          id: uniqueId(),
          type: PanelType.HOME,
        } as Panel,
      ]
      set(key, defaultPanels)
      return defaultPanels
    }
    return panels
  }
}

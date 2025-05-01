import { get, set } from 'idb-keyval'
import { localDB } from '@penx/local-db'
import { store } from '@penx/store'
import { Panel, PanelType, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

const PANELS = 'PANELS'

export class AppService {
  inited = false

  async init() {
    store.app.setAppLoading(true)

    // TODO: handle site empty
    const site = (await localDB.site.toCollection().first())!
    const siteId = site.id

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

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

    store.site.saveSite(site)

    const panels = await this.getPanels(site.id)
    const molds = await localDB.mold.where({ siteId }).toArray()
    const tags = await localDB.tag.where({ siteId }).toArray()

    store.site.setSite(site)
    store.molds.setMolds(molds)
    store.tags.setTags(tags)
    store.panels.setPanels(panels)
    store.app.setAppLoading(false)
    this.inited = true
  }

  private async getPanels(siteId: string) {
    const panels: Panel[] = (await get(`${PANELS}_${siteId}`)) || []
    if (!panels.length) {
      const defaultPanels = [
        {
          id: uniqueId(),
          type: PanelType.HOME,
        } as Panel,
      ]
      set(PANELS, defaultPanels)
      return defaultPanels
    }
    return panels
  }
}

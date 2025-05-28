import { i18n } from '@lingui/core'
import { format } from 'date-fns'
import { get, set } from 'idb-keyval'
import ky from 'ky'
import { Node } from '@penx/domain'
import { localDB } from '@penx/local-db'
import {
  IAreaNode,
  ICreationNode,
  IJournalNode,
  isAreaNode,
  isCreationNode,
  isCreationTagNode,
  ISiteNode,
  isStructNode,
  isTagNode,
  NodeType,
} from '@penx/model-type'
import { updateSession } from '@penx/session'
import { store } from '@penx/store'
import { Panel, PanelType, SessionData, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { initLocalSite } from './lib/initLocalSite'
import { isRowsEqual } from './lib/isRowsEqual'
import { syncNodesToLocal } from './lib/syncNodesToLocal'

const PANELS = 'PANELS'

export class AppService {
  constructor() {}
  inited = false

  async init(session: SessionData) {
    console.log('=======app=session:', session)

    store.app.setAppLoading(true)
    // store.app.setAppLoading(false)
    // return
    try {
      const site = await this.getInitialSite(session)

      console.log('============site:', site)

      await this.initStore(site)
      this.inited = true
    } catch (error) {
      console.log('init error=====>>>:', error)
    }
  }

  private async getInitialSite(session: SessionData): Promise<ISiteNode> {
    if (!session) {
      const sites = await localDB.listAllSites()
      const site = sites.find((s) => s.props.isRemote) || sites?.[0]
      if (site) return site
      return initLocalSite()
    }

    if (!navigator.onLine) {
      if (!session.siteId) {
        const sites = await localDB.listAllSites()
        if (sites) return sites[0]
        return initLocalSite()
      }

      const site = await localDB.getSite(session.siteId)
      if (site) return site
      return initLocalSite()
    }

    if (session.siteId) {
      const sites = await localDB.listAllSiteByUserId(session.userId)
      const site = sites.find((s) => s.props.isRemote)

      if (site) {
        await syncNodesToLocal(site.id)
        return site
      }

      console.log('>>>>>>>>>>_------------')

      const remoteSite = await syncNodesToLocal(session.siteId)
      console.log('=======remoteSite:', remoteSite)

      return remoteSite
    }

    let site = await localDB.getSiteByUserId(session.userId)

    if (!site) {
      site = await initLocalSite(session.userId)
    }

    const nodes = await localDB.listNodes(site.id)

    const { existed, siteId } = await ky
      .post('/api/app/sync-initial-nodes', {
        json: { nodes },
      })
      .json<{ ok: boolean; existed: boolean; siteId: string }>()

    if (existed) {
      site = await syncNodesToLocal(siteId)
    } else {
      await localDB.updateSiteProps(site.id, { isRemote: true })
      await syncNodesToLocal(site.id)
    }

    await updateSession({
      activeSiteId: site.id,
      siteId: site.id,
    })
    return site
  }

  private async initStore(site: ISiteNode) {
    // console.log('=============site..:', site)
    await store.site.save(site)

    const nodes = await localDB.listNodes(site.id)
    const areas = nodes.filter((n) => isAreaNode(n))

    const localVisit = await store.visit.fetch()

    const area =
      areas.find(
        (a) => a.id === localVisit.activeAreaId || a.props.isGenesis,
      ) || areas[0]

    const visit = await store.visit.save({ activeAreaId: area.id })
    const structs = nodes
      .filter((n) => n.areaId === area.id)
      .filter((n) => isStructNode(n))
    const tags = nodes.filter((n) => isTagNode(n))
    const creationTags = nodes.filter((n) => isCreationTagNode(n))
    const creations = nodes.filter(
      (n) => isCreationNode(n) && n.areaId === area.id,
    )

    const panels = await this.getPanels(area)

    store.site.set(site)
    store.creations.set(creations as ICreationNode[])
    store.visit.set(visit)
    store.area.set(area)
    store.areas.set(areas)
    store.structs.set(structs)
    store.tags.set(tags)
    store.creationTags.set(creationTags)
    store.panels.set(panels)
    store.app.setAppLoading(false)
  }

  private async getPanels(area: IAreaNode) {
    const key = `${PANELS}_${area.id}`
    const panels: Panel[] = (await get(key)) || []

    if (!panels.length) {
      const date = new Date()
      const dateStr = format(date, 'yyyy-MM-dd')

      const journals = await localDB.listJournals(area.id)
      let journal = journals.find(
        (n) => n.type === NodeType.JOURNAL && n.props.date === dateStr,
      )!

      if (!journal) {
        journal = {
          id: uniqueId(),
          type: NodeType.JOURNAL,
          props: {
            date: dateStr,
            children: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          siteId: area.siteId,
          userId: area.userId,
          areaId: area.id,
        }

        await localDB.addJournal(journal)
      }

      const defaultPanels = [
        {
          id: uniqueId(),
          type: PanelType.JOURNAL,
          date: dateStr,
        } as Panel,
      ]
      set(key, defaultPanels)
      return defaultPanels
    }
    return panels
  }
}

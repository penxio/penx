import { Shape, ShapeStream } from '@electric-sql/client'
import { i18n } from '@lingui/core'
import { format } from 'date-fns'
import { get, set } from 'idb-keyval'
import ky from 'ky'
import { SHAPE_URL } from '@penx/constants'
import { Node } from '@penx/domain'
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
import { db } from '@penx/pg'
import { updateSession } from '@penx/session'
import { store } from '@penx/store'
import { Panel, PanelType, SessionData, Widget } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { sleep } from '@penx/utils'
import { initLocalSite } from './lib/initLocalSite'

const PANELS = 'PANELS'

export class AppService {
  constructor() {}
  inited = false

  async init(session: SessionData) {
    store.app.setAppLoading(true)
    // store.app.setAppLoading(false)
    // return
    try {
      const site = await this.getInitialSite(session)
      console.log('init============site:', site)

      await this.initStore(site)
      this.inited = true
    } catch (error) {
      console.log('init error=====>>>:', error)
    }
  }

  private async getInitialSite(session: SessionData): Promise<ISiteNode> {
    if (!session) {
      const sites = await db.listAllSites()

      const site = sites.find((s) => s.props.isRemote) || sites?.[0]
      if (site) return site
      return initLocalSite()
    }

    if (!navigator.onLine) {
      if (!session.siteId) {
        const sites = await db.listAllSites()
        if (sites) return sites[0]
        return initLocalSite()
      }

      const site = await db.getSite(session.siteId)
      if (site) return site
      return initLocalSite()
    }

    if (session.siteId) {
      const sites = await db.listAllSiteByUserId(session.userId)
      const site = sites.find((s) => s.props.isRemote)

      if (site) return site

      const stream = new ShapeStream({
        url: SHAPE_URL,
        params: {
          table: 'node',
          where: `"siteId" = '${session.siteId}'`,
        },
      })

      const shape = new Shape(stream)
      const rows = await shape.rows

      if (rows.length > 0) {
        while (true) {
          const site = await db.getSite(session.siteId)
          if (site) return site
          await sleep(100)
        }
      }
    }

    let site = await db.getSiteByUserId(session.userId)

    if (!site) {
      site = await initLocalSite(session.userId)
    }

    const nodes = await db.listNodes(site.id)

    const { existed, siteId } = await ky
      .post('/api/app/sync-initial-nodes', {
        json: { nodes },
      })
      .json<{ ok: boolean; existed: boolean; siteId: string }>()

    await db.updateSiteProps(site.id, { isRemote: true })

    await updateSession({
      activeSiteId: site.id,
      siteId: site.id,
    })
    return site
  }

  private async initStore(site: ISiteNode) {
    // console.log('=============site..:', site)
    await store.site.save(site)
    const nodes = await db.listNodes(site.id)

    console.log('------nodes:', nodes)

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

      const journals = await db.listJournals(area.id)
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

        await db.addJournal(journal)
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

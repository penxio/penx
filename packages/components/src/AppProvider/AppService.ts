import { t } from '@lingui/core/macro'
import { format } from 'date-fns'
import { get, set } from 'idb-keyval'
import { api } from '@penx/api'
import { Node } from '@penx/domain'
import { generateStructNode } from '@penx/libs/getDefaultStructs'
import { localDB } from '@penx/local-db'
import {
  IAreaNode,
  ICreationNode,
  IJournalNode,
  isAreaNode,
  isCreationNode,
  isCreationTagNode,
  ISiteNode,
  isJournalNode,
  isStructNode,
  isTagNode,
  NodeType,
} from '@penx/model-type'
import { updateSession } from '@penx/session'
import { store } from '@penx/store'
import { Panel, PanelType, SessionData, StructType, Widget } from '@penx/types'
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

      // console.log('===========getInital=site:', site)
      await this.initStore(site)
    } catch (error) {
      console.log('init error=====>>>:', error)
      store.app.setAppError('App init error: ' + error.message)
      store.app.setAppLoading(false)
    }

    this.inited = true
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

    // console.log('========session.siteId:', session.siteId)

    if (session.siteId) {
      const sites = await localDB.listAllSiteByUserId(session.userId)
      const site = sites.find((s) => s.props.isRemote)

      if (site) {
        await syncNodesToLocal(site.id)
        return site
      }

      const remoteSite = await syncNodesToLocal(session.siteId)

      return remoteSite
    }

    let site = await localDB.getSiteByUserId(session.userId)

    if (!site) {
      site = await initLocalSite(session.userId)
    }

    const nodes = await localDB.listSiteNodes(site.id)

    await api.syncInitialNodes(
      nodes.map((n) => ({
        ...n,
        createdAt: new Date(n.createdAt).getTime().toString(),
        updatedAt: new Date(n.updatedAt).getTime().toString(),
      })),
    )

    await localDB.updateSiteProps(site.id, { isRemote: true })
    await syncNodesToLocal(site.id)

    await updateSession({
      activeSiteId: site.id,
      siteId: site.id,
    })

    return site
  }

  private async initStore(site: ISiteNode) {
    // console.log('=============site..:', site)
    await store.site.save(site)

    const nodes = await localDB.listSiteNodes(site.id)

    const areas = nodes.filter((n) => isAreaNode(n))

    const localVisit = await store.visit.fetch()

    const area =
      areas.find(
        (a) => a.id === localVisit.activeAreaId || a.props.isGenesis,
      ) || areas[0]

    const visit = await store.visit.save({ activeAreaId: area.id })

    const areaNodes = nodes.filter((n) => n.areaId === area.id)
    const structs = areaNodes.filter((n) => isStructNode(n))
    let journals = areaNodes.filter((n) => isJournalNode(n))

    const imageStruct = structs.find((s) => s.props.type === StructType.IMAGE)
    if (!imageStruct) {
      const newStruct = generateStructNode({
        type: StructType.IMAGE,
        name: t`Image`,
        siteId: site.id,
        userId: site.userId,
        areaId: area.id,
      })
      await localDB.addStruct(newStruct)
      structs.push(newStruct)
    }

    // console.log('======journals:', journals)

    // const mergedJournals = mergeJournals(journals)

    // if (journals.length !== mergedJournals.length) {
    //   return await localDB.transaction('rw', localDB.node, async () => {
    //     await localDB.node.bulkDelete(journals.map((n) => n.id))
    //     await localDB.node.bulkPut(mergedJournals)
    //   })
    // }

    // journals = mergedJournals

    // console.log('=====journals:', journals)

    const tags = areaNodes.filter((n) => isTagNode(n))
    const creationTags = areaNodes.filter((n) => isCreationTagNode(n))
    const creations = areaNodes.filter((n) => isCreationNode(n))

    const panels = await this.getPanels(area)

    store.site.set(site)
    store.creations.set(creations)
    store.visit.set(visit)
    store.area.set(area)
    store.areas.set(areas)
    store.journals.set(journals)
    store.structs.set(structs)
    store.tags.set(tags)
    store.creationTags.set(creationTags)
    store.panels.set(panels)
    store.app.setAppLoading(false)
  }

  private async getPanels(area: IAreaNode) {
    const key = `${PANELS}_${area.id}`
    const panels: Panel[] = (await get(key)) || []

    // console.log('====panels:', panels)

    const journalPanel = panels.find((p) => p.type === PanelType.JOURNAL)

    if (!journalPanel) {
      const date = new Date()
      const dateStr = format(date, 'yyyy-MM-dd')

      const journals = await localDB.listJournals(area.id)
      let journal = journals.find((n) => n.props.date === dateStr)!

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

      const journalPanel: Panel = {
        id: uniqueId(),
        type: PanelType.JOURNAL,
        date: dateStr,
      }

      panels.push(journalPanel)

      set(key, panels)
      return panels
    }
    return panels
  }
}

function mergeJournals(journals: IJournalNode[]) {
  const accumulator = journals.reduce(
    (acc, item) => {
      if (!acc[item.props.date]) {
        acc[item.props.date] = item
      } else {
        acc[item.props.date].props.children.push(...item.props.children)
      }
      return acc
    },
    {} as Record<string, IJournalNode>,
  )

  return Object.values(accumulator)
}

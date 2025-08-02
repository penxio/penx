import { t } from '@lingui/core/macro'
import { format } from 'date-fns'
import { get, set } from 'idb-keyval'
import { api } from '@penx/api'
import { Node } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { widgetAtom } from '@penx/hooks/useWidget'
import { checkMnemonic } from '@penx/libs/checkMnemonic'
import { generateStructNode } from '@penx/libs/getDefaultStructs'
import { localDB } from '@penx/local-db'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import {
  IAreaNode,
  ICreationNode,
  IJournalNode,
  isAreaNode,
  isCreationNode,
  isCreationTagNode,
  IShortcutNode,
  isJournalNode,
  ISpaceNode,
  isShortcutNode,
  isStructNode,
  isTagNode,
  NodeType,
} from '@penx/model-type'
import { updateSession } from '@penx/session'
import { store } from '@penx/store'
import {
  ColumnType,
  Panel,
  PanelType,
  SessionData,
  StructType,
  Widget,
} from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { fixBookmarkStruct } from './lib/fixBookmarkStruct'
import { fixStructsViews } from './lib/fixStructsViews'
import { fixTaskStruct } from './lib/fixTaskStruct'
import { initLocalSpace } from './lib/initLocalSpace'
import { isRowsEqual } from './lib/isRowsEqual'
import { syncNodesToLocal } from './lib/syncNodesToLocal'

const PANELS = 'PANELS'

export class AppService {
  constructor() {}
  inited = false

  async init(session: SessionData) {
    console.log('=======app=session:')

    // const nodes = await localDB.node.findMany({})
    // await localDB.node.deleteNodeByIds(nodes.map((n) => n.id))
    // return

    // const nodes = await localDB.node.findMany({})
    // console.log(
    //   '=========nodes:',
    //   nodes.map((n) => format(n.createdAt, 'yyyy-MM-dd HH:mm:ss')),
    // )
    // return

    store.app.setAppLoading(true)
    // store.app.setAppLoading(false)
    // return

    if (session) {
      try {
        await checkMnemonic(session)
      } catch (error) {
        if (error.message === 'DECRYPT_MNEMONIC_NEEDED') {
          store.app.setPasswordNeeded(true)
          return
        }
        console.log('====error.message:')
        //
      }
    }

    try {
      const space = await this.getInitialSpace(session)

      // console.log('===========getInital=space:', space)
      await this.initStore(space)
    } catch (error) {
      console.log('init error=====>>>:', error)
      store.app.setAppError('App init error: ' + error.message)
      store.app.setAppLoading(false)
    }

    this.inited = true
  }

  private async getInitialSpace(session: SessionData): Promise<ISpaceNode> {
    if (!session) {
      const spaces = await localDB.listAllSpaces()
      const space = spaces.find((s) => s.props.isRemote) || spaces?.[0]
      if (space) return space
      return initLocalSpace()
    }

    if (!navigator.onLine) {
      if (!session.spaceId) {
        const spaces = await localDB.listAllSpaces()
        if (spaces) return spaces[0]
        return initLocalSpace()
      }

      const space = await localDB.getSpace(session.spaceId)
      if (space) return space
      return initLocalSpace()
    }

    // console.log('========session.spaceId:', session.spaceId)

    if (session.spaceId) {
      const spaces = await localDB.listAllSpaceByUserId(session.userId)
      const space = spaces.find((s) => s.props.isRemote)

      console.log('=======spaces:', spaces)

      if (space) {
        await syncNodesToLocal(space.id)
        return space
      }

      const remoteSite = await syncNodesToLocal(session.spaceId)

      return remoteSite
    }

    let space = await localDB.getSpaceByUserId(session.userId)

    if (!space) {
      space = await initLocalSpace(session.userId)
    }

    const nodes = await localDB.listSpaceNodes(space.id)

    await api.syncInitialNodes(
      nodes.map((n) => ({
        ...n,
        createdAt: new Date(n.createdAt).getTime().toString(),
        updatedAt: new Date(n.updatedAt).getTime().toString(),
      })),
    )

    await localDB.updateSpaceProps(space.id, { isRemote: true })
    await syncNodesToLocal(space.id)

    await updateSession({
      activeSpaceId: space.id,
      spaceId: space.id,
    })

    return space
  }

  private async initStore(space: ISpaceNode) {
    await store.space.save(space)

    const nodes = await localDB.listSpaceNodes(space.id)

    const areas = nodes.filter((n) => isAreaNode(n))

    const localVisit = await store.visit.fetch()

    const area =
      areas.find(
        (a) => a.id === localVisit.activeAreaId || a.props.isGenesis,
      ) || areas[0]

    const visit = await store.visit.save({ activeAreaId: area.id })

    const areaNodes = nodes.filter((n) => n.areaId === area.id)
    let structs = areaNodes.filter((n) => isStructNode(n))
    let journals = areaNodes.filter((n) => isJournalNode(n))

    let shortcut = areaNodes.find((n) => isShortcutNode(n))
    if (!shortcut) {
      shortcut = await localDB.addNode({
        id: uniqueId(),
        type: NodeType.SHORTCUT,
        props: {
          shortcuts: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        spaceId: area.spaceId,
        userId: area.userId,
        areaId: area.id,
      } as IShortcutNode)
    }

    const imageStruct = structs.find((s) => s.props.type === StructType.IMAGE)
    if (!imageStruct) {
      const newStruct = generateStructNode({
        type: StructType.IMAGE,
        name: t`Image`,
        spaceId: space.id,
        userId: space.userId,
        areaId: area.id,
      })
      await localDB.addStruct(newStruct)
      structs.push(newStruct)
    }

    const snippetStruct = structs.find(
      (s) => s.props.type === StructType.SNIPPET,
    )

    if (!snippetStruct) {
      const newStruct = generateStructNode({
        type: StructType.SNIPPET,
        name: t`Snippet`,
        spaceId: space.id,
        userId: space.userId,
        areaId: area.id,
      })
      await localDB.addStruct(newStruct)
      structs.push(newStruct)
    }

    const promptStruct = structs.find((s) => s.props.type === StructType.PROMPT)
    if (!promptStruct) {
      const newStruct = generateStructNode({
        type: StructType.PROMPT,
        name: t`Prompt`,
        spaceId: space.id,
        userId: space.userId,
        areaId: area.id,
      })
      await localDB.addStruct(newStruct)
      structs.push(newStruct)
    }

    const quicklinkStruct = structs.find(
      (s) => s.props.type === StructType.QUICK_LINK,
    )
    if (!quicklinkStruct) {
      const newStruct = generateStructNode({
        type: StructType.QUICK_LINK,
        name: t`Quicklink`,
        spaceId: space.id,
        userId: space.userId,
        areaId: area.id,
      })
      await localDB.addStruct(newStruct)
      structs.push(newStruct)
    }

    structs = await fixTaskStruct(area.id, structs)
    structs = await fixBookmarkStruct(area.id, structs)
    structs = await fixStructsViews(area.id, structs)

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

    store.space.set(space)
    store.app.setShortcut(shortcut)
    store.creations.set(creations)
    store.visit.set(visit)
    store.area.set(area)
    store.areas.set(areas)
    store.journals.set(journals)
    store.structs.set(structs)
    store.tags.set(tags)
    store.creationTags.set(creationTags)
    store.panels.set(panels)
    store.set(widgetAtom, area.props.widgets[0])
    store.app.setAppLoading(false)
  }

  private async getPanels(area: IAreaNode) {
    const key = `${PANELS}_${area.id}`
    const panels: Panel[] = (await get(key)) || []

    // console.log('====panels:', panels)

    const journalPanel = panels.find((p) => p.type === PanelType.JOURNAL)

    if (!journalPanel && !panels.length) {
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
          spaceId: area.spaceId,
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

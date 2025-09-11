import { storage } from '@/lib/storage'
import { format } from 'date-fns'
import { defaultEditorContent } from '@penx/constants'
import { Creation, Struct } from '@penx/domain'
import { getCreationFields } from '@penx/libs/getCreationFields'
import { localDB } from '@penx/local-db'
import {
  BrowserTab,
  IAreaNode,
  ICreationNode,
  IStructNode,
  NodeType,
} from '@penx/model-type'
import {
  ColumnType,
  CreationStatus,
  GateType,
  SessionData,
  StructType,
} from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { sendMessage } from './message'

interface Tab {
  status?: string | undefined
  index: number
  openerTabId?: number | undefined
  title?: string | undefined
  url?: string | undefined
  pendingUrl?: string | undefined
  pinned: boolean
  highlighted: boolean
  windowId: number
  active: boolean
  favIconUrl?: string | undefined
  frozen: boolean
  id?: number | undefined
  incognito: boolean
  selected: boolean
  audible?: boolean | undefined
  discarded: boolean
  autoDiscardable: boolean
  mutedInfo?: {
    muted: boolean
  }
  width?: number | undefined
  height?: number | undefined
  sessionId?: string | undefined
  groupId: number
  lastAccessed?: number | undefined
}

export async function syncTabs() {
  const session = await storage.getSession()

  console.log('=========>>>>>session:', session)

  if (!session) return

  syncInitialTabs(session)

  browser.tabs.onCreated.addListener((tab) => {
    console.log('Tab created:', tab)
  })

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // console.log('Tab updated:', tabId, changeInfo, tab)

    if (changeInfo.status === 'complete') {
      console.log('>>>>>>Tab ' + tabId + ' finished loading:', tab.url, tab)

      const { tabNodes, tabStruct, area } = await getSpaceInfo()
      const existed = tabNodes.find((t) => {
        const fields = getCreationFields<BrowserTab>(
          new Struct(tabStruct),
          new Creation(t),
        )
        return fields.id === tab.id
      })

      // console.log('======existed:', existed)
      if (existed) {
        const fields = getCreationFields<BrowserTab>(
          new Struct(tabStruct),
          new Creation(existed),
        )
        if (fields.url !== tab.url) {
          const cells = getCells(tab, tabStruct)
          await localDB.updateCreationProps(existed.id, {
            ...existed.props,
            title: tab.title,
            cells,
          })

          sendMessage('updateBrowserTab', {})
        }
      } else {
        await createTabCreation(tab, area, tabStruct)
        sendMessage('updateBrowserTab', {})
      }
    }

    if (changeInfo.url) {
      // console.log(
      //   '>>>>>>>>Tab ' + tabId + ' url changed to:',
      //   changeInfo.url,
      //   tab,
      // )
    }
  })

  browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    console.log('Tab removed:', tabId, removeInfo)

    const { tabNodes, tabStruct } = await getSpaceInfo()
    const existed = tabNodes.find((t) => {
      const fields = getCreationFields<BrowserTab>(
        new Struct(tabStruct),
        new Creation(t),
      )
      return fields.id === tabId
    })
    if (existed) {
      await localDB.node.delete(existed.id)
      sendMessage('updateBrowserTab', {})
    }
  })

  browser.tabs.onActivated.addListener(function (activeInfo) {
    console.log('Tab activated:', activeInfo)
  })

  browser.tabs.onAttached.addListener((tabId, attachInfo) => {
    console.log(
      'tab ' +
        tabId +
        ' attached to window ' +
        attachInfo.newWindowId +
        ' at position ' +
        attachInfo.newPosition,
    )
  })

  browser.tabs.onDetached.addListener((tabId, detachInfo) => {
    console.log(
      'tab ' +
        tabId +
        ' detached from window ' +
        detachInfo.oldWindowId +
        ' at position ' +
        detachInfo.oldPosition,
    )
  })

  browser.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
    console.log(
      'tab ' + removedTabId + ' has been replaced by tab ' + addedTabId,
    )
  })
}

async function getSpaceInfo() {
  const session = await storage.getSession()
  // console.log('=====session:', session)
  const areas = await localDB.listAreas(session.spaceId)

  const area = areas[0]

  const structs = await localDB.listStructs(area.id)

  // console.log('=======structs:', structs)

  const tabStruct = structs.find((s) => s.props.type === StructType.BROWSER_TAB)
  if (!tabStruct) throw new Error('No tab struct')

  const tabNodes = (await localDB.listCreations(area.id)).filter(
    (c) => c.props.structId === tabStruct.id,
  )
  return {
    tabStruct,
    tabNodes,
    area,
  }
}

async function syncInitialTabs(session: SessionData) {
  let tabs = await browser.tabs.query({})

  console.log('==========tabs:', tabs)

  const { tabNodes, tabStruct, area } = await getSpaceInfo()
  console.log('=======>>>>>>>>>tabNodes:', tabNodes)

  if (tabNodes.length) return

  for (const tab of tabs) {
    createTabCreation(tab, area, tabStruct)
  }
}

function getCells(tab: Tab, tabStruct: IStructNode) {
  const cells = tabStruct.props.columns.reduce(
    (acc, column) => {
      let value: any = ''
      if (column.slug === 'id') value = tab.id
      if (column.slug === 'windowId') value = tab.windowId
      if (column.slug === 'url') value = tab.url
      if (column.slug === 'favIconUrl') value = tab.favIconUrl
      if (column.slug === 'active') value = tab.active
      if (column.slug === 'muted') value = tab.mutedInfo?.muted
      if (column.slug === 'pinned') value = tab.pinned
      if (column.slug === 'lastAccessed') value = tab.lastAccessed
      if (column.slug === 'index') value = tab.index

      return { ...acc, [column.id]: value }
    },
    {} as Record<string, any>,
  )
  return cells
}

async function createTabCreation(
  tab: Tab,
  area: IAreaNode,
  tabStruct: IStructNode,
) {
  const cells = getCells(tab, tabStruct)

  const props: ICreationNode['props'] = {
    slug: uniqueId(),
    title: tab.title || '',
    description: '',
    content: defaultEditorContent,
    data: {},
    icon: '',
    image: '',
    type: tabStruct.type,
    cells,
    podcast: {},
    i18n: {},
    gateType: GateType.FREE,
    status: CreationStatus.DRAFT,
    commentStatus: 'OPEN',
    featured: false,
    collectible: false,
    structId: tabStruct.id,
    isJournal: false,
    isPopular: false,
    checked: false,
    delivered: false,
    commentCount: 0,
    cid: '',
    openedAt: new Date(),
    date: format(new Date(), 'yyyy-MM-dd'),
  }

  const newCreation: ICreationNode = {
    id: uniqueId(),
    spaceId: area.spaceId,
    type: NodeType.CREATION,
    areaId: area.id,
    props,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: area.userId,
  }

  // console.log('=====cells:', cells, 'newCreation:', newCreation)
  await localDB.addCreation(newCreation)
}

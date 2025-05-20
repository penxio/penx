// import { BACKGROUND_EVENTS } from './lib/constants'
import { BACKGROUND_EVENTS } from '@/lib/constants'
import {
  AREAS_KEY,
  FAIL,
  spacesKey,
  SUCCESS,
  type MsgRes,
  type TabInfo,
} from '@/lib/helper'
import { parsePreparedContent } from '@/lib/parser'
import { Storage } from '@plasmohq/storage'
import { get } from 'idb-keyval'
import { CommentStatus } from '@penx/db/client'
import { localDB } from '@penx/local-db'
import { IAreaNode, ICreationNode, NodeType } from '@penx/model-type'
import {
  CreationStatus,
  StructType,
  GateType,
  SessionData,
} from '@penx/types'
import { uniqueId } from '@penx/unique-id'

const storage = new Storage()

export default defineBackground(() => {
  //
  /**
   * Receive and process events from each page
   */
  chrome.runtime.onMessage.addListener(
    (
      message: MsgRes<keyof typeof BACKGROUND_EVENTS, any>,
      sender,
      sendResponse,
    ) => {
      console.log('%c=bgjs-onMessage.addListener-0:', 'color:red', message)
      switch (message.type) {
        case BACKGROUND_EVENTS.QueryTab: {
          saveCurrentPage(message.payload)
          break
        }
        case BACKGROUND_EVENTS.SCREEN_SHOT: {
          console.log(
            '%c=bgjs-onMessage.addListener-2:',
            'color:red',
            BACKGROUND_EVENTS.SCREEN_SHOT,
          )
          chrome.tabs.query({ lastFocusedWindow: true }, (res) => {
            chrome.tabs.captureVisibleTab(res[0].windowId as number, (url) => {
              console.log(
                '%c=bgjs-onMessage.addListener-2-1::',
                'color:red',
                url,
              )
              sendResponse(url)
            })
          })
          break
        }

        case BACKGROUND_EVENTS.QUERY_AREAS: {
          queryAreas().then(async (areas) => {
            sendResponse({ msg: 'ok', code: SUCCESS, areas })
            console.log('=====areas:', areas)
            await storage.set(AREAS_KEY, areas)
          })
          break
        }
        case BACKGROUND_EVENTS.SUBMIT_CONTENT: {
          console.log('========request.payload:', message.payload)
          const content = message.payload.content as string
          const area = message.payload.area as IAreaNode
          addNote(content, area).then(() => {
            sendResponse({ msg: 'ok', code: SUCCESS })
          })
        }

        case BACKGROUND_EVENTS.INIT_POPUP: {
          sendResponse({ msg: 'ok', code: SUCCESS })
          break
        }
      }

      return true
    },
  )

  async function saveCurrentPage(tabInfo: TabInfo) {
    if (tabInfo.status !== 'complete') {
      // show message to user on page yet to complete load
      // setMessageToFrontEnd(BACKGROUND_EVENTS.TabNotComplete, {
      //   text: 'Page loading...',
      // })
    } else if (tabInfo.status === 'complete') {
      await getPageContent(tabInfo)
    }
  }

  async function getPageContent(tabInfo: TabInfo) {}
})

async function queryAreas() {
  const session = await get('SESSION')
  if (session?.siteId) {
    return localDB.listAreas(session.siteId)
  }
  const sites = await localDB.listAllSites()
  const site = sites.find((site) => site.props.isRemote) || sites[0]
  return localDB.listAreas(site.id)
}

async function addNote(content: string, area: IAreaNode) {
  const site = await localDB.getSite(area.siteId)
  const structs = await localDB.listStructs(area.siteId)
  const struct = structs.find((struct) => struct.props.type === StructType.NOTE)!

  const creation: ICreationNode = {
    id: uniqueId(),
    type: NodeType.CREATION,
    props: {
      slug: uniqueId(),
      structId: struct.id,
      title: content.slice(0, 20),
      description: '',
      content: noteToContent(content),
      image: '',
      props: {},
      type: StructType.NOTE,
      areaId: area.id,
      icon: '',
      podcast: {},
      i18n: {},
      gateType: GateType.FREE,
      status: CreationStatus.DRAFT,
      commentStatus: CommentStatus.OPEN,
      featured: false,
      collectible: false,
      isJournal: false,
      isPopular: false,
      checked: false,
      delivered: false,
      commentCount: 0,
      cid: '',
      openedAt: new Date(),
    },
    userId: site.userId,
    siteId: struct.siteId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await localDB.addCreation(creation)
}

const noteToContent = (str: string) => {
  const content = str.split('\n')
  const slateValue = content.map((line) => ({
    type: 'p',
    children: [{ text: line }],
  }))
  return JSON.stringify(slateValue)
}

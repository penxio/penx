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
import { IArea, ICreation } from '@penx/model-type'
import {
  CreationStatus,
  CreationType,
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
          const area = message.payload.area as IArea
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
    return localDB.area.where({ siteId: session.siteId }).toArray()
  }
  const sites = await localDB.site.toArray()
  const site = sites.find((site) => site.isRemote) || sites[0]
  return localDB.area.where({ siteId: site.id }).toArray()
}

async function addNote(content: string, area: IArea) {
  const site = await localDB.site.get(area.siteId)
  const molds = await localDB.mold.where({ siteId: area.siteId }).toArray()
  const mold = molds.find((mold) => mold.type === CreationType.NOTE)!

  const creation: ICreation = {
    id: uniqueId(),
    slug: uniqueId(),
    moldId: mold.id,
    title: content.slice(0, 20),
    description: '',
    content: noteToContent(content),
    image: '',
    props: {},
    type: CreationType.NOTE,
    areaId: area.id,
    siteId: mold.siteId,
    icon: '',
    podcast: {},
    i18n: {},
    userId: site.userId,
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

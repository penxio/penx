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
import { syncBookmarks } from '@/lib/syncBookmarks'
import { syncTabs } from '@/lib/syncTabs'
import { initTranslate } from '@/lib/initTranslate'
import { Storage } from '@plasmohq/storage'
import { get } from 'idb-keyval'
import { localDB } from '@penx/local-db'
import { IAreaNode, ICreationNode, NodeType } from '@penx/model-type'
import { CreationStatus, GateType, SessionData, StructType } from '@penx/types'
import { stringToDoc } from '@penx/utils/editorHelper'

const storage = new Storage()

export default defineBackground(() => {
  syncTabs()
  syncBookmarks()
  initTranslate()

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
  if (session?.spaceId) {
    return localDB.listAreas(session.spaceId)
  }
  const spaces = await localDB.listAllSpaces()
  const space = spaces.find((item) => item.props.isRemote) || spaces[0]
  return localDB.listAreas(space.id)
}

async function addNote(content: string, area: IAreaNode) {
  const site = await localDB.getSpace(area.spaceId)
  const structs = await localDB.listStructs(area.id)
  const struct = structs.find(
    (struct) => struct.props.type === StructType.NOTE,
  )!

  const creation: ICreationNode = {} as any

  // await localDB.addCreation(creation)
}

const noteToContent = (str: string) => {
  return JSON.stringify(stringToDoc(str))
}

// import { BACKGROUND_EVENTS } from './lib/constants'
import { initWebsocket } from '@/entrypoints/background/initWebsocket'
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
import { Storage } from '@plasmohq/storage'
import { get } from 'idb-keyval'
import { localDB } from '@penx/local-db'
import { IAreaNode, ICreationNode, NodeType } from '@penx/model-type'
import { CreationStatus, GateType, SessionData, StructType } from '@penx/types'
import { stringToDoc } from '@penx/utils/editorHelper'
import { checkExtension } from './checkExtension'
import { setupMessage } from './setupMessage'

export default defineBackground(() => {
  syncTabs()
  syncBookmarks()
  initWebsocket()

  setupMessage()
  // checkExtension()
})

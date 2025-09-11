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
import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite/vector'
import { Storage } from '@plasmohq/storage'
import { get } from 'idb-keyval'
import { initPGLiteNodeModelApi } from '@penx/libs/initPGLiteNodeModelApi'
import { localDB } from '@penx/local-db'
import { IAreaNode, ICreationNode, NodeType } from '@penx/model-type'
import { CreationStatus, GateType, SessionData, StructType } from '@penx/types'
import { stringToDoc } from '@penx/utils/editorHelper'
import { checkExtension } from './checkExtension'
import { setupMessage } from './setupMessage'
import { setupSidePanel } from './setupSidePanel'

initPGLiteNodeModelApi()

export default defineBackground(() => {
  syncTabs()
  // syncBookmarks()
  initWebsocket()
  setupMessage()
  setupSidePanel()
  // checkExtension()
})

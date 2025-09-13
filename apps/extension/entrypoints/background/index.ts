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
import { initPGLiteNodeModelApi } from '@penx/libs/initPGLiteNodeModelApi'
import { localDB } from '@penx/local-db'
import { IAreaNode, ICreationNode, NodeType } from '@penx/model-type'
import { stringToDoc } from '@penx/utils/editorHelper'
import { checkExtension } from './checkExtension'
import { setupMessage } from './setupMessage'
import { setupSidePanel } from './setupSidePanel'
import { setupUserscripts } from './setupUserscripts'

initPGLiteNodeModelApi()

export default defineBackground(async () => {
  syncTabs()
  // syncBookmarks()
  initWebsocket()
  setupMessage()
  setupSidePanel()
  // checkExtension()

  setupUserscripts()
})

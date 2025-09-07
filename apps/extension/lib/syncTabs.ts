import { storage } from '@/lib/storage'
import { localDB } from '@penx/local-db'
import { StructType } from '@penx/types'

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
  console.log('sync tabs.....')

  let tabs = await chrome.tabs.query({})

  console.log('==========tabs:', tabs)

  const session = await storage.getSession()

  console.log('=====session:', session)
  const areas = await localDB.listAreas(session.spaceId)

  const area = areas[0]

  const structs = await localDB.listStructs(area.id)

  console.log('=======structs:', structs)

  const tabStruct = structs.find((s) => s.props.type === StructType.BROWSER_TAB)
  if (!tabStruct) return

  const tabNodes = (await localDB.listCreations(area.id)).filter(
    (c) => c.props.structId === tabStruct.id,
  )
  console.log('=======>>>>>>>>>tabNodes:', tabNodes)
  if (tabNodes.length) return
}

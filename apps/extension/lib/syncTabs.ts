import ky from 'ky'

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
  mutedInfo?: any
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

  tabs[0].active
}

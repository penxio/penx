export type BrowserTab = {
  id: number
  windowId: number
  url: string
  favIconUrl: string
  active: boolean
  muted: boolean
  pinned: boolean
  lastAccessed: string
  index: string
}

export type Userscript = {
  enabled: boolean
  version: string
  description: string
  homepage: string
  downloadURL: string
  match: string
  code: string
  isRunInSandbox: boolean
}

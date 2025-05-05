import type { ACTIONS } from './constants'

export type TabInfo = {
  active: boolean
  audible: boolean
  autoDiscardable: boolean
  discarded: boolean
  favIconUrl: string
  groupId: number
  height: number
  highlighted: boolean
  id: number
  incognito: boolean
  index: number
  mutedInfo: {
    muted: boolean
  }
  pinned: boolean
  selected: boolean
  status: string
  title: string
  url: string
  width: number
  windowId: number
}

type ActionKeys = (typeof ACTIONS)[keyof typeof ACTIONS]

export interface MsgRes<T extends ActionKeys, I> {
  type: T
  payload: I
}

export const storageDocKey = 'PENX-DOC'
export const selectedSpaceKey = 'SELECTED-SPACE'
export const spacesKey = 'SPACES'

export const AREAS_KEY = 'AREAS'

export const SUCCESS = 'SUCCESS'
export const FAIL = 'FAIL'

import type { NodeModelApi } from '@penx/local-db'

declare module 'shikwasa'

declare global {
  interface Window {
    nodeModelApi: NodeModelApi
    __SITE__: any
    __SITE_ID__: string
    __USER_ID__: string
    __PLAYER__: any
  }
}

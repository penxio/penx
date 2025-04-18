import { Site } from '@penx/db/client'

declare global {
  interface Window {
    __site__: site
    __SITE_ID__: string
    __USER_ID__: string
    __PLAYER__: any
  }
}

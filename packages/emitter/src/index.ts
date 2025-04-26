import mitt from 'mitt'
import { Site } from '@penx/types'

export type AppEvent = {
  SITE_UPDATED: Site
  KEY_DOWN_ENTER_ON_TITLE: undefined
  CREATION_UPDATED: any
  ON_LOGOUT_SUCCESS: undefined
  ROUTE_TO_SETTINGS: undefined
  DESKTOP_LOGIN_SUCCESS: any
}

export const appEmitter = mitt<AppEvent>()

import mitt from 'mitt'
import { ICreationNode } from '@penx/model-type'
import { Site } from '@penx/types'

export type AppEvent = {
  SITE_UPDATED: Site
  KEY_DOWN_ENTER_ON_TITLE: undefined
  CREATION_UPDATED: any
  ON_LOGOUT_SUCCESS: undefined
  ROUTE_TO_SETTINGS: undefined
  ROUTE_TO_DESIGN: undefined
  ROUTE_TO_CREATION: any
  DESKTOP_LOGIN_SUCCESS: any
  APP_LOGIN_SUCCESS: any
  FOCUS_EDITOR: undefined
  PANEL_CREATION_UPDATED: ICreationNode
}

export const appEmitter = mitt<AppEvent>()

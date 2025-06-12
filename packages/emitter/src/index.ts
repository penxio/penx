import mitt from 'mitt'
import { ICreationNode } from '@penx/model-type'
import { Site } from '@penx/types'

export type AppEvent = {
  SITE_UPDATED: Site
  KEY_DOWN_ENTER_ON_TITLE: undefined
  CREATION_UPDATED: any
  ON_LOGOUT_SUCCESS: undefined
  DESKTOP_LOGIN_SUCCESS: any
  APP_LOGIN_SUCCESS: any
  FOCUS_EDITOR: undefined
  PANEL_CREATION_UPDATED: ICreationNode

  DELETE_ACCOUNT: any

  ROUTE_TO_SETTINGS: undefined
  ROUTE_TO_DESIGN: undefined
  ROUTE_TO_CREATION: any
  ROUTE_TO_STRUCT: any
  ROUTE_TO_ALL_STRUCTS: any
  ROUTE_TO_LOGIN: any
  ROUTE_TO_UPGRADE: any
  ROUTE_TO_PROFILE: any
  ROUTE_TO_WIDGET: any
  ROUTE_TO_SYNC: any
  ROUTE_TO_STRUCT_INFO: any
}

export const appEmitter = mitt<AppEvent>()

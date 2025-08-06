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
  ROUTE_TO_LOGIN: any
  ROUTE_TO_UPGRADE: any
  ROUTE_TO_ALL_STRUCTS: any
  ROUTE_TO_PROFILE: any
  ROUTE_TO_WIDGET: any
  ROUTE_TO_SYNC: any
  ROUTE_TO_STRUCT_INFO: any
  ROUTE_TO_NEW_CREATION: any
  ROUTE_TO_TASKS: any
  ROUTE_TO_TAG_CREATIONS: any
  ROUTE_TO_STRUCT_CREATIONS: any
  ROUTE_TO_BACK: any

  SELECT_DATE: Date
  IMPACT: any

  START_SYNC_NODES: any
  STOP_SYNC_NODES: any

  // command panel
  ON_ESCAPE_IN_COMMAND: undefined

  ON_COMMAND_PALETTE_SEARCH_CHANGE: string

  ON_COMMAND_PALETTE_FILTER_CHANGE: any

  FOCUS_SEARCH_BAR_INPUT: undefined

  ON_APPLICATION_DIR_CHANGE: undefined

  ON_AREA_SELECTED: undefined

  CLOSE_ACTION_POPOVER: undefined

  DELETE_CREATION_SUCCESS: string

  REFRESH_COMMANDS: any

  SUBMIT_QUICK_INPUT: undefined
  SUBMIT_CREATE_STRUCT: undefined

  SUBMIT_AI_CHAT: undefined
}

export const appEmitter = mitt<AppEvent>()

import mitt from 'mitt'

export type Events = {
  ADD_NODE?: string
  ADD_SPACE?: string

  ADD_TAG?: string

  SPLIT_RIGHT?: string

  EXPORT_TO_MARKDOWN?: string
  EXPORT_TO_PDF?: string
  EXPORT_TO_HTML?: string
}

export const emitter = mitt<Events>()

export type ShareEvent = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

type AppEvents = {
  onShare: ShareEvent

  SIGN_IN_GOOGLE: undefined

  SIGN_OUT: undefined

  SIGN_OUT_SUCCESSFULLY: undefined

  SIGN_IN_DESKTOP: undefined

  LOGIN_BY_PERSONAL_TOKEN_SUCCESSFULLY: undefined

  LOAD_CLOUD_SPACES: undefined

  ON_ESCAPE_IN_COMMAND: undefined

  ON_COMMAND_PALETTE_SEARCH_CHANGE: string

  ON_COMMAND_PALETTE_FILTER_CHANGE: any

  FOCUS_SEARCH_BAR_INPUT: undefined

  SUBMIT_FORM_APP: number
}

export const appEmitter = mitt<AppEvents>()

export const BASE_URL = import.meta.env.WXT_ROOT_HOST

export enum AppType {
  CLIP_PAGE = 'CLIP_PAGE',
  SCREEN_SHOT = 'SCREEN_SHOT',
  WRITE = 'WRITE',
  NOTE = 'NOTE',
  BOOKMARK = 'BOOKMARK',
}

// selection container id
export const PENX_SELECTION_CONTAINER = 'penx-selection-container'

// sandbox iframe id
export const PENX_SANDBOX_BOARD_IFRAME = 'penx-sandbox-board-iframe'

export enum SandBoxMessageType {
  getSelectedHtml = 'getSelectedHtml',

  initSandbox = 'initSandbox',

  startOcr = 'startOcr',
}

export enum ClippingTypeEnum {
  // selection content
  area = 'area',
  // selection website
  website = 'website',
}

export const ACTIONS = {
  EnterManually: 'ENTER_MANUALLY',
  AreaSelect: 'AREA_SELECT',
}

export const BACKGROUND_EVENTS = {
  QueryTab: 'QUERY_TAB',
  TabNotComplete: 'TAB_NOT_COMPLETE',
  GetPageContent: 'GET_PAGE_CONTENT',
  EndOfGetPageContent: 'ENDOF_GET_PAGECONTENT',
  SCREEN_SHOT: 'background/screen-shot',
  SUBMIT_CONTENT: 'background/submit-content',
  INIT_POPUP: 'background/init_popup',
  QUERY_AREAS: 'QUERY_AREAS',
}

export const PENX_SERVER_HOST = 'http://localhost:14158'

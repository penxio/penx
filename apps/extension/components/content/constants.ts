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

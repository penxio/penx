import type { TElement } from '@udecode/plate'

export interface TBidirectionalLinkElement extends TElement {
  creationId: string
}

export interface TBidirectionalLinkInputElement extends TElement {
  trigger: string
}

export interface TBidirectionalLinkItemBase {
  text: string
  key?: any
}

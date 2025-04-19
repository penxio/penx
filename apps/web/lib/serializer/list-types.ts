import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_TITLE,
  ELEMENT_UL,
} from '@penx/constants'
import { BaseElement } from 'slate'

export interface TitleElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_TITLE
  nodeType?: string
  props?: {
    date: string
  }
}

export interface ListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_UL | typeof ELEMENT_OL
}

export interface UnorderedListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_UL
  children: ListItemElement[]
}

export interface OrderedListElement extends BaseElement {
  id: string
  type: typeof ELEMENT_OL
  children: any[]
}

export interface ListItemElement extends BaseElement {
  id: string
  type: typeof ELEMENT_LI
  children: (UnorderedListElement | ListContentElement)[] // [lic | ul]
}

export interface ListContentElement extends BaseElement {
  id: string
  type: typeof ELEMENT_LIC
  collapsed: boolean
}

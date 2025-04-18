import { ItemSimpleChaptersChapterElement } from './item-simple-chapters-chapter-element'

export interface ItemSimpleChaptersChaptersElementBody {
  _attr?: {
    version: '1.2'
    'xmlns:psc': 'http://podlove.org/simple-chapters'
  }
}

export interface ItemSimpleChaptersChaptersElement {
  'psc:chapters':
    | ItemSimpleChaptersChaptersElementBody[]
    | ItemSimpleChaptersChapterElement[]
}

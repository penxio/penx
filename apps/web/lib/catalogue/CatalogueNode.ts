import {
  CatalogueNodeJSON,
  CatalogueNodeType,
  ICatalogueNode,
} from '@/lib/model'
import { CreateCatalogueNodeOptions } from './types'

export class CatalogueNode {
  id: string // nodeId or groupId

  folded: boolean

  type: CatalogueNodeType

  emoji?: string

  uri?: string

  title?: string

  children: CatalogueNode[] = []

  get isDoc(): boolean {
    return this.type === CatalogueNodeType.POST
  }

  get isCategory(): boolean {
    return this.type === CatalogueNodeType.CATEGORY
  }

  get foldable(): boolean {
    return !!this.children?.length
  }

  constructor(options: CreateCatalogueNodeOptions) {
    this.id = options.id
    this.type = options.type
    this.folded = options.folded ?? false
    this.emoji = options.emoji
    this.title = options.title
    this.uri = options.uri
  }

  toJSON(): CatalogueNodeJSON {
    return {
      id: this.id,
      folded: this.folded,
      type: this.type,
      uri: this.uri || '',
      emoji: this.emoji,
      title: this.title,
      hasChildren: this.children.length > 0,
    }
  }
}

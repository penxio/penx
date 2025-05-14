import { format } from 'date-fns'
import {
  ELEMENT_FILE,
  ELEMENT_FILE_CONTAINER,
  ELEMENT_IMG,
  ELEMENT_TODO,
  FILE_DATABASE_NAME,
  TODO_DATABASE_NAME,
} from '@penx/constants'
import { INode, NodeType } from '@penx/model-type'

export class Node {
  parentId: string

  props: Record<string, any> = {}

  constructor(public raw: INode) {
    this.props = this.raw?.props || {}
  }

  get id(): string {
    return this.raw?.id || ''
  }

  get siteId(): string {
    return this.raw.siteId
  }

  get userId(): string {
    return this.raw.siteId
  }

  get type(): string {
    return this.raw?.type || ''
  }

  get title(): string {
    return this.props?.title || ''
  }

  get isArea() {
    return this.type === NodeType.AREA
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }

  toHash(): string {
    //
    return ''
  }
}

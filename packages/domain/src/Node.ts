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

  get spaceId(): string {
    return this.raw.spaceId
  }

  get userId(): string {
    return this.raw.userId
  }

  get structId(): string {
    return this.raw.props.structId
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

  get isStruct() {
    return this.type === NodeType.STRUCT
  }

  get isCreation() {
    return this.type === NodeType.CREATION
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

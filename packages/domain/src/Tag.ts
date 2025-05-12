import { ITagNode } from '@penx/model-type'

export class Tag {
  constructor(public raw: ITagNode) {}

  get id(): string {
    return this.raw?.id || ''
  }

  get siteId(): string {
    return this.raw.siteId
  }

  get userId(): string {
    return this.raw.siteId
  }

  get name(): string {
    return this.raw.props.name || ''
  }

  get color() {
    return this.raw.props.color
  }

  get creationCount() {
    return this.raw.props.creationCount
  }

  get createdAt() {
    return this.raw.createdAt
  }

  get updatedAt() {
    return this.raw.updatedAt
  }
}

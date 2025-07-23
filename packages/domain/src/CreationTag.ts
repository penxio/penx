import { ICreationTagNode } from '@penx/model-type'

export class CreationTag {
  constructor(public raw: ICreationTagNode) {}

  get id(): string {
    return this.raw?.id || ''
  }

  get spaceId(): string {
    return this.raw.spaceId
  }

  get userId(): string {
    return this.raw.userId
  }

  get tagId(): string {
    return this.raw.props.tagId
  }

  get creationId(): string {
    return this.raw.props.creationId
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }
}

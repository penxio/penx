import { IMoldNode } from '@penx/model-type'

export class Mold {
  constructor(public raw: IMoldNode) {}

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
    return this.raw.props?.type || ''
  }

  get name(): string {
    return this.raw.props.name || ''
  }

  get props() {
    return this.raw.props.props || []
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }
}

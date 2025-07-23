import { IAreaNode, INode, NodeType } from '@penx/model-type'
import { getUrl } from '@penx/utils'

export class Area {
  props: IAreaNode['props']
  constructor(public raw: IAreaNode) {
    this.props = this.raw?.props || {}
  }

  get id(): string {
    return this.raw?.id || ''
  }

  get slug(): string {
    return this.raw.props.slug
  }

  get spaceId(): string {
    return this.raw.spaceId
  }

  get userId(): string {
    return this.raw.userId
  }

  get type(): string {
    return this.raw?.type || ''
  }

  get name(): string {
    return this.props.name || ''
  }

  get description() {
    return this.props.description
  }

  get about() {
    return this.props.about
  }

  get chargeMode() {
    return this.props.chargeMode
  }

  get logo() {
    return this.props.logo ? getUrl(this.props.logo) : ''
  }

  get widgets() {
    return this.props.widgets || []
  }

  get favorites() {
    return this.props.favorites || []
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }
}

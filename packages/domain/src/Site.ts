import { IAreaNode, INode, ISiteNode, NodeType } from '@penx/model-type'
import { getUrl } from '@penx/utils'

export class Site {
  props: ISiteNode['props']

  constructor(public raw: ISiteNode) {
    this.props = this.raw?.props || {}
  }

  get id(): string {
    return this.raw?.id || ''
  }

  get siteId(): string {
    return this.raw.siteId
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

  get logo() {
    return this.props.logo ? getUrl(this.props.logo) : ''
  }

  get image() {
    return this.props.image ? getUrl(this.props.image) : ''
  }

  get config() {
    return this.props.config
  }

  get aiProviders() {
    return this.props.aiProviders
  }

  get createdAt() {
    return this.raw.createdAt
  }

  get updatedAt() {
    return this.raw.updatedAt
  }
}

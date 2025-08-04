import { IAreaNode, INode, ISpaceNode, NodeType } from '@penx/model-type'
import { getUrl } from '@penx/utils'

export class Space {
  props: ISpaceNode['props']

  constructor(public raw: ISpaceNode) {
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

  get aiProviders() {
    return this.props.aiSetting.providers
  }

  get config() {
    return this.props.config
  }

  get aiSetting() {
    return this.props.aiSetting
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }
}

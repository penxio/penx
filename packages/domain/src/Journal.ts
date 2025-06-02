import { IAreaNode, IJournalNode, INode, NodeType } from '@penx/model-type'
import { getUrl } from '@penx/utils'

export class Journal {
  props: IJournalNode['props']
  constructor(public raw: IJournalNode) {
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

  get date() {
    return this.props.date
  }

  get children() {
    return this.props.children || []
  }

  get hasNotes() {
    return this.children.length > 0
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }
}

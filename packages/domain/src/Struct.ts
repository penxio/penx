import { IStructNode } from '@penx/model-type'

export class Struct {
  constructor(public raw: IStructNode) {}

  get id() {
    return this.raw?.id || ''
  }

  get siteId() {
    return this.raw.siteId
  }

  get userId() {
    return this.raw.siteId
  }

  get type() {
    return this.raw.props.type || ''
  }

  get name() {
    return this.raw.props.name || ''
  }

  get pluralName() {
    return this.raw.props.pluralName || ''
  }

  get color() {
    return this.raw.props.color || ''
  }

  get activeViewId() {
    return this.raw.props.activeViewId || this.viewIds[0]
  }

  get viewIds() {
    return this.raw.props.viewIds
  }

  get columns() {
    return this.raw.props.columns
  }

  get views() {
    return this.raw.props.views
  }

  get currentView() {
    return (
      this.views.find((view) => view.id === this.activeViewId) || this.views[0]
    )
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

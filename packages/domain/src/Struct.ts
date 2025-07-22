import { IStructNode } from '@penx/model-type'
import { StructType } from '@penx/types'

export class Struct {
  constructor(public raw: IStructNode) {}

  get id() {
    return this.raw?.id || ''
  }

  get siteId() {
    return this.raw.siteId
  }

  get userId() {
    return this.raw.userId
  }

  get type() {
    return this.raw.props.type || ''
  }

  get name() {
    return this.raw.props.name || ''
  }

  get pluralName() {
    return this.raw.props.pluralName || this.name
  }

  get description() {
    return this.raw.props.description || ''
  }

  get color() {
    return this.raw.props.color || ''
  }

  get emoji() {
    return this.raw.props?.emoji || ''
  }

  get activeViewId() {
    return this.raw.props.activeViewId || this.viewIds?.[0]
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

  get primaryColumn() {
    return this.columns.find((c) => c.isPrimary)!
  }

  get currentView() {
    return (
      this.views.find((view) => view.id === this.activeViewId) || this.views[0]
    )
  }

  get isTask() {
    return this.type === StructType.TASK
  }

  get isImage() {
    return this.type === StructType.IMAGE
  }

  get isNote() {
    return this.type === StructType.NOTE
  }

  get createdAt() {
    return new Date(this.raw.createdAt)
  }

  get updatedAt() {
    return new Date(this.raw.updatedAt)
  }
}

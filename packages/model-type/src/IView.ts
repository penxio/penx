import { Filter, Group, Sort, ViewColumn, ViewType } from '@penx/types'

export interface IView {
  id: string
  name: string
  description: string
  viewType: ViewType
  viewColumns: ViewColumn[]
  sorts: Sort[]
  groups: Group[]
  filters: Filter[]
  kanbanColumnId: string
  kanbanOptionIds: string[]
  createdAt: Date
  updatedAt: Date
}

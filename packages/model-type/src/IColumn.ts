import { ColumnType, Option } from '@penx/types'

export interface IColumn {
  id: string
  slug: string
  name: string
  description: string
  columnType: ColumnType
  config: any
  options: Option[]
  isPrimary: boolean
  createdAt: Date
  updatedAt: Date
}

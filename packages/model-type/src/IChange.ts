export interface IChange {
  id: string
  operation: 'CREATE' | 'UPDATE' | 'DELETE'
  table: string
  siteId: string
  key: string
  data: any
  synced: boolean
  createdAt: Date
}

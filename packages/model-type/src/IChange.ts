export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface IChange {
  id: number
  operation: OperationType
  spaceId: string
  key: string
  data?: any
  synced: number // 0 - not synced, 1 - synced
  createdAt: Date
}

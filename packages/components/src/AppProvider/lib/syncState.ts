import type {
  ChangeMessage,
  Offset,
  Row,
  ShapeStreamInterface,
  ShapeStreamOptions,
} from '@electric-sql/client'
import { get, set } from 'idb-keyval'

export type InitialInsertMethod = 'insert' | 'csv' | 'json' | 'useCopy'

export type Lsn = string

export type InsertChangeMessage = ChangeMessage<any> & {
  headers: { operation: 'insert' }
}

export interface ElectricSyncState {
  handle: string
  offset: Offset
  last_lsn: Lsn
}

export async function getElectricSyncState() {
  const state = await get(`electric-sync-state`)
  return (state || {}) as ElectricSyncState
}

export async function setElectricSyncState(state: ElectricSyncState) {
  await set(`electric-sync-state`, state)
}

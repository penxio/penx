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

export async function getElectricSyncState(siteId: string) {
  const state = await get(`electric-sync-state-${siteId}`)
  return (state || {}) as ElectricSyncState
}

export async function setElectricSyncState(
  siteId: string,
  state: ElectricSyncState,
) {
  await set(`electric-sync-state-${siteId}`, state)
}

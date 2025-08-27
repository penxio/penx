import _ from 'lodash'
import { idb } from '@penx/indexeddb'
import { SessionData } from '@penx/types'

export const getChanges = async (session: SessionData) => {
  const changes = await idb.change
    .where({ spaceId: session.spaceId, synced: 0 })
    .sortBy('id')

  return changes.filter((change) => {
    if (
      Reflect.has(change.data, 'userId') &&
      change.data.userId !== session.userId
    ) {
      return false
    }
    if (change.synced) return false
    return true
  })
}

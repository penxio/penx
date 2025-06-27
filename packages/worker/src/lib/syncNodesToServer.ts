import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import _ from 'lodash'
import { api } from '@penx/api'
import { isDesktop, isMobileApp, ROOT_HOST } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { IChange, OperationType } from '@penx/model-type'
import { SessionData } from '@penx/types'

export async function syncNodesToServer() {
  const session = (await get('SESSION')) as SessionData

  if (!session || !session?.siteId) return

  const site = await localDB.getSite(session.siteId)

  if (!site) return

  const getChanges = async () => {
    const changes = await localDB.change
      .where({ siteId: session.siteId, synced: 0 })
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

  const changes = await getChanges()

  const grouped = changes.reduce(
    (acc, cur) => {
      if (!acc[cur.key]) acc[cur.key] = []
      acc[cur.key].push(cur)
      return acc
    },
    {} as Record<string, IChange[]>,
  )

  const mergedChanges = Object.values(grouped)
    .map((list) => {
      const first = _.first(list) as IChange
      const last = _.last(list) as IChange
      const isAllUpdate = list.every(
        (change) => change.operation === OperationType.UPDATE,
      )
      if (isAllUpdate) return last

      if (
        first?.operation === OperationType.CREATE &&
        last?.operation === OperationType.DELETE
      ) {
        return null
      }

      if (last?.operation === OperationType.DELETE) {
        return last as IChange
      }

      if (list[0].operation === OperationType.CREATE) {
        if (list.length === 1) return first
        return produce(first, (draft) => {
          draft.createdAt = first.data.createdAt
          draft.data.props = {
            ...draft.data.props,
            ...last.data,
          }
          draft.data.createdAt = first.data.createdAt
          draft.data.updatedAt = last.data.updatedAt
        })
      }
      return null
    })
    .filter((change) => !!change)

  const mergedChangeIds = mergedChanges.map((change) => change.id)

  const deleteChangeIds = changes
    .filter((c) => !mergedChangeIds.includes(c.id))
    .map((c) => c.id)

  await localDB.change.where('id').anyOf(deleteChangeIds).delete()

  for (const { id, ...rest } of mergedChanges) {
    await localDB.change.update(id, rest)
  }

  const newChanges = await getChanges()

  const errors: any = []
  for (const change of newChanges) {
    const data = {
      operation: change.operation,
      siteId: change.siteId,
      key: change.key,
      data: change.data,
    }

    if (change.data?.createdAt) {
      data.data.createdAt = new Date(change.data?.createdAt)
        .getTime()
        .toString()
    }

    if (change.data?.updatedAt) {
      data.data.updatedAt = new Date(change.data?.updatedAt)
        .getTime()
        .toString()
    }

    try {
      let headers: Record<string, string> = {}

      if (isDesktop || isMobileApp) {
        const session = await get('SESSION')
        if (session?.accessToken) {
          headers.Authorization = `Bearer ${session.accessToken}`
        }
      }

      // console.log('=======headers:', headers)

      const res = await fetch(`${ROOT_HOST}/api/v1/sync`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      const json = await res.json()

      // await api.sync(data)
      // console.log('>>>>>change synced:', change)

      // await localDB.change.update(change.id, { synced: 1 })
      await localDB.change.delete(change.id)
    } catch (error) {
      console.log('error syncing change:', error)
      errors.push(error)
    }
  }

  if (errors.length > 0) {
    throw new Error('Syncing changes failed')
  }
}

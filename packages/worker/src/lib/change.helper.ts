import ky from 'ky'
import _ from 'lodash'
import { ApiRes } from '@penx/api'
import { APP_LOCAL_HOST, isDesktop, isExtension } from '@penx/constants'
import { idb } from '@penx/indexeddb'
import { IChange } from '@penx/model-type'
import { SessionData } from '@penx/types'

export const getChanges = async (session: SessionData) => {
  let changes: IChange[] = []

  if (isExtension || isDesktop) {
    const res = await ky
      .get(`${APP_LOCAL_HOST}/api/change/listBySpace`, {
        searchParams: { spaceId: session.spaceId },
      })
      .json<ApiRes<IChange[]>>()
    changes = res.data
  } else {
    changes = await idb.change
      .where({ spaceId: session.spaceId, synced: 0 })
      .sortBy('id')
  }

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

export async function deleteChangeByIds(ids: number[]) {
  if (isExtension || isDesktop) {
    return ky
      .post(`${APP_LOCAL_HOST}/api/change/deleteByIds`, {
        json: { ids },
      })
      .json()
  }

  return idb.change.where('id').anyOf(ids).delete()
}

export async function updateChange(data: IChange) {
  if (isExtension || isDesktop) {
    return ky
      .post(`${APP_LOCAL_HOST}/api/change/update`, {
        json: data,
      })
      .json()
  }

  const { id, ...rest } = data
  return idb.change.update(id, rest)
}

export async function deleteChange(id: number) {
  if (isExtension || isDesktop) {
    return ky
      .post(`${APP_LOCAL_HOST}/api/change/deleteOne`, {
        json: { id },
      })
      .json()
  }

  return idb.change.delete(id)
}

import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import _ from 'lodash'
import { api } from '@penx/api'
import { isDesktop, isMobileApp, ROOT_HOST } from '@penx/constants'
import { encryptString } from '@penx/encryption'
import { checkMnemonic } from '@penx/libs/checkMnemonic'
import { localDB } from '@penx/local-db'
import { IChange, ICreationNode, OperationType } from '@penx/model-type'
import { SessionData } from '@penx/types'

export async function syncNodesToServer() {
  const session = (await get('SESSION')) as SessionData

  if (!session || !session?.spaceId || !session.publicKey) return

  const site = await localDB.getSpace(session.spaceId)

  if (!site) return

  await checkMnemonic(session)

  const getChanges = async () => {
    const changes = await localDB.change
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
      if (isAllUpdate) {
        const data = list.reduce(
          (acc, cur) => ({ ...acc, ...cur.data }),
          {} as Record<string, any>,
        )
        return { ...last, data }
      }

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
        const [_, ...updateList] = list

        const props = updateList.reduce(
          (acc, cur) => ({ ...acc, ...cur.data }),
          first.data.props,
        )

        return produce(first, (draft) => {
          draft.createdAt = first.data.createdAt
          draft.data.props = props
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

  // const mnemonic = await getMnemonicFromLocal

  for (const change of newChanges) {
    const input = {
      operation: change.operation,
      spaceId: change.spaceId,
      key: change.key,
      data: change.data,
    }

    if (change.data?.createdAt) {
      input.data.createdAt = new Date(change.data?.createdAt)
        .getTime()
        .toString()
    }

    if (change.data?.updatedAt) {
      input.data.updatedAt = new Date(change.data?.updatedAt)
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
      const url = await getSyncUrl()

      // const res = await fetch(url, {
      //   method: 'POST',
      //   headers,
      //   body: JSON.stringify(data),
      // })

      // const json = await res.json()

      console.log('=====input:', input)

      const encryptedInput = produce(input, (draft) => {
        const props =
          change.operation === OperationType.CREATE
            ? (draft.data.props as ICreationNode['props'])
            : (draft.data as ICreationNode['props'])

        if (props.title) {
          props.title = encryptString(props.title, session.publicKey)
        }

        if (props.content) {
          props.content = encryptString(
            JSON.stringify(props.content),
            session.publicKey,
          )
        }
        if (props.cells) {
          props.cells = encryptString(
            JSON.stringify(props.cells),
            session.publicKey,
          )
        }
        if (props.data) {
          props.data = encryptString(
            JSON.stringify(props.data),
            session.publicKey,
          )
        }
      })

      console.log('======encryptedInput:', encryptedInput)

      // console.log('>>>>>change synced:', change)
      await api.sync(url, encryptedInput)
      await localDB.change.delete(change.id)
    } catch (error) {
      console.log('error syncing change:', error)
      errors.push(error)
    }
  }

  console.log('=========errors:', errors)

  if (errors.length > 0) {
    throw new Error('Syncing changes failed')
  }
}

async function getSyncUrl() {
  const session = await get('SESSION')

  if (session.syncServer?.host && session.syncServer?.enabled) {
    return `${session.syncServer.host}/api/v1/sync`
  }

  return `${ROOT_HOST}/api/v1/sync`
}

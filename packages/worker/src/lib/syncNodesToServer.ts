import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import _ from 'lodash'
import { api } from '@penx/api'
import {
  APP_LOCAL_HOST,
  isDesktop,
  isMobileApp,
  ROOT_HOST,
} from '@penx/constants'
import { checkMnemonic } from '@penx/libs/checkMnemonic'
import { encryptByPublicKey } from '@penx/mnemonic'
import { IChange, ICreationNode, OperationType } from '@penx/model-type'
import { SessionData } from '@penx/types'
import {
  deleteChange,
  deleteChangeByIds,
  getChanges,
  updateChange,
} from './change.helper'
import { mergeChanges } from './mergeChanges'

export async function syncNodesToServer() {
  const session = (await get('SESSION')) as SessionData

  if (!session || !session?.spaceId || !session.publicKey) return

  // const site = await localDB.getSpace(session.spaceId)

  // if (!site) return

  await checkMnemonic(session)
  console.log('>>>>>>>>>meno:', session)

  const changes = await getChanges(session)
  console.log('=======>>>>>>changes:', changes)

  const mergedChanges = mergeChanges(changes)

  const mergedChangeIds = mergedChanges.map((change) => change.id)

  const deleteChangeIds = changes
    .filter((c) => !mergedChangeIds.includes(c.id))
    .map((c) => c.id)

  await deleteChangeByIds(deleteChangeIds)

  for (const change of mergedChanges) {
    await updateChange(change)
  }

  const newChanges = await getChanges(session)

  console.log('========newChanges:', newChanges)

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
          props.title = encryptByPublicKey(props.title, session.publicKey)
        }

        if (props.content) {
          props.content = encryptByPublicKey(
            JSON.stringify(props.content),
            session.publicKey,
          )
        }
        if (props.cells) {
          props.cells = encryptByPublicKey(
            JSON.stringify(props.cells),
            session.publicKey,
          )
        }
        if (props.data) {
          props.data = encryptByPublicKey(
            JSON.stringify(props.data),
            session.publicKey,
          )
        }
      })

      console.log('======encryptedInput:', encryptedInput)

      // console.log('>>>>>change synced:', change)
      await api.sync(url, encryptedInput)

      await deleteChange(change.id)
    } catch (error) {
      console.log('error syncing change:', error)
      console.log('change>>>>>>>>>>:', change)

      if (error.errorCode === 'NODE_NOT_EXISTED') {
        if (isDesktop) {
          await deleteChange(change.id)
          // const node = await ky
          //   .get(`${APP_LOCAL_HOST}/api/get`, {
          //     searchParams: { id: change.key },
          //   })
          //   .json()

          // console.log('=======>>>>>NODE_NOT_EXISTED:node:', node)
        }

        await deleteChange(change.id)
      }
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

import ky from 'ky'
import { has } from 'lodash'
import { ApiRes } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { calculateSHA256FromString } from '@penx/encryption'
import { localDB } from '@penx/local-db'
import { getSession } from '@penx/session'
import { syncNodesToLocal } from '../../../AppProvider/lib/syncNodesToLocal'
import { setElectricSyncState } from '../../../AppProvider/lib/syncState'

interface Snapshot {
  id: string
  hash: string
}

export async function syncNodesByDiff(spaceId: string) {
  const session = await getSession()
  const host = session.syncServer?.host || ''

  if (!host) {
    throw new Error('No sync server URL found')
  }

  const { data = [] } = await ky
    .get(`${host}/api/v1/snapshot`, {
      searchParams: { spaceId },
    })
    .json<ApiRes<Snapshot[]>>()

  console.log('======data:', data)
  let updatedNodes: any[] = []
  let createdNodes: any[] = []
  let deletedNodes: any[] = []

  const nodes = await localDB.listSpaceNodes(spaceId)

  console.log('====nodes:', nodes)

  const ID_TO_HASH = new Map(data.map((i) => [i.id, i.hash]))

  let i = 0
  for (const n of nodes) {
    const hash = calculateSHA256FromString(
      JSON.stringify({
        areaId: n.areaId || '',
        ...(n.props as any),
      }),
    )

    if (ID_TO_HASH.has(n.id)) {
      // is equal, no need to sync
      if (hash === ID_TO_HASH.get(n.id)) {
        // console.log('====:', i++)
      } else {
        // not equal, push to server
        updatedNodes.push(n)
      }
      ID_TO_HASH.delete(n.id)
      continue
    } else {
      createdNodes.push(n)
    }
  }

  deletedNodes = Array.from(ID_TO_HASH).map((i) => i[0])

  const input = {
    updatedNodes,
    createdNodes,
    deletedNodes,
  }

  console.log('input=====:', input)

  // console.log('url===========url:', host, 'nodes:', nodes)
  await ky.post(`${host}/api/v1/syncByDiff`, {
    json: {
      spaceId,
      updatedNodes,
      createdNodes,
      deletedNodes,
    },
  })

  appEmitter.emit('STOP_SYNC_NODES')
  await setElectricSyncState(spaceId, {} as any)
  await syncNodesToLocal(spaceId)
}

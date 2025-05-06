import { get, set } from 'idb-keyval'
import { isDesktop, ROOT_HOST } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { api } from '@penx/trpc-client'
import { SessionData } from '@penx/types'
import { sleep } from '@penx/utils'

export async function pollingSyncToRemote() {
  let pollingInterval = 5 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    console.log('sync to remote...........isDesktop:', isDesktop)
    await sync()
    await sleep(pollingInterval)
  }
}

async function sync() {
  const session = (await get('SESSION')) as SessionData

  if (!session || !session?.siteId) return

  const site = await localDB.site.where({ id: session.siteId }).first()

  if (!site) return

  const changes = await localDB.change
    .where({ siteId: session.siteId, synced: 0 })
    .sortBy('id')

  for (const change of changes) {
    if (change.synced) continue

    const data = {
      operation: change.operation,
      table: change.table,
      siteId: change.siteId,
      key: change.key,
      data: change.data,
    }

    try {
      // fetch('https://jsonplaceholder.typicode.com/todos/1')
      //   .then((response) => response.json())
      //   .then((json) => console.log(json))

      // fetch(`${ROOT_HOST}/api/v1/sync`)
      //   .then((response) => response.json())
      //   .then((json) => console.log(json))

      // await api.sync.push.mutate(data)

      let headers: Record<string, string> = {}

      if (isDesktop) {
        const session = await get('SESSION')
        if (session?.accessToken) {
          headers.Authorization = session.accessToken
        }
      }

      await fetch(`${ROOT_HOST}/api/v1/sync`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      // await localDB.change.update(change.id, { synced: 1 })
      await localDB.change.delete(change.id)
    } catch (error) {
      console.log('error syncing change:', error)
    }
  }
}

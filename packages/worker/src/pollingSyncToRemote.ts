import { get, set } from 'idb-keyval'
import { isDesktop, isMobileApp, ROOT_HOST } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { api } from '@penx/trpc-client'
import { SessionData } from '@penx/types'
import { sleep } from '@penx/utils'

export async function pollingSyncToRemote() {
  let pollingInterval = 5 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    // console.log('sync to remote...........isDesktop:', isDesktop)
    await sync()
    await sleep(pollingInterval)
  }
}

async function sync() {
  console.log('sync to remote.......')

  const session = (await get('SESSION')) as SessionData

  if (!session || !session?.siteId) return

  const site = await localDB.getSite(session.siteId)

  if (!site) return

  const changes = await localDB.change
    .where({ siteId: session.siteId, synced: 0 })
    .sortBy('id')

  for (const change of changes) {
    if (change.synced) continue

    const data = {
      operation: change.operation,
      siteId: change.siteId,
      key: change.key,
      data: change.data,
    }

    try {
      let headers: Record<string, string> = {}

      if (isDesktop || isMobileApp) {
        const session = await get('SESSION')
        if (session?.accessToken) {
          headers.Authorization = session.accessToken
        }
      }

      const res = await fetch(`${ROOT_HOST}/api/v1/sync`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      const json = res.json()

      // await localDB.change.update(change.id, { synced: 1 })
      await localDB.change.delete(change.id)
    } catch (error) {
      console.log('error syncing change:', error)
    }
  }
}

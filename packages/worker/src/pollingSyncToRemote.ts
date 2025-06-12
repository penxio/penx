import { get } from 'idb-keyval'
import { api } from '@penx/api'
import { isDesktop } from '@penx/constants'
import { sleep } from '@penx/utils'
import { syncNodesToServer } from './lib/syncNodesToServer'

export async function pollingSyncToRemote() {
  // let pollingInterval = 5 * 1000
  let pollingInterval = (await get('SYNC_INTERVAL')) || 1000 * 60 * 30

  console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    console.log('sync to remote...........isDesktop:', isDesktop)
    try {
      await syncNodesToServer()
    } catch (error) {
      console.log('pollingSyncToRemote error:', error)
    }
    await sleep(pollingInterval)
  }
}

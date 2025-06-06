import { api } from '@penx/api'
import { isDesktop } from '@penx/constants'
import { sleep } from '@penx/utils'
import { syncNodesToServer } from './lib/syncNodesToServer'

export async function pollingSyncToRemote() {
  let pollingInterval = 5 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    console.log('sync to remote...........isDesktop:', isDesktop)
    await syncNodesToServer()
    await sleep(pollingInterval)
  }
}

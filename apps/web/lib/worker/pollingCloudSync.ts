import { get } from 'idb-keyval'
import { SITE_MODE } from '@penx/constants'
import { getLocalSession } from '../local-session'
import { sync } from '../sync'
import { sleep } from '../utils'

export async function pollingCloudSync() {
  let pollingInterval = 10 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  // while (true) {
  // }
}

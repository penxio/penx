import { WorkerEvents } from '@penx/constants'
import { pollingBackupToGoogle } from './pollingBackupToGoogle'
import { pollingCloudSync } from './pollingCloudSync'
import { pollingSyncToRemote } from './pollingSyncToRemote'

console.log('workder........xxxxxxxxxxxxxxxxx')

self.addEventListener('message', async (event) => {
  if (event.data === WorkerEvents.START_POLLING) {
    console.log('===========start polling......')
    // pollingBackupToGoogle()
    // pollingCloudSync()
    pollingSyncToRemote()
  }
})

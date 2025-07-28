import { Buffer } from 'buffer'
import { WorkerEvents } from '@penx/constants'
import { pollingBackupToGoogle } from './pollingBackupToGoogle'
import { pollingCheckTodayJournal } from './pollingCheckTodayJournal'
import { pollingCloudSync } from './pollingCloudSync'
import { pollingSyncToRemote } from './pollingSyncToRemote'

self.Buffer = Buffer

self.addEventListener('message', async (event) => {
  if (event.data === WorkerEvents.START_POLLING) {
    console.log('===========start polling......')
    // pollingBackupToGoogle()
    // pollingCloudSync()
    pollingSyncToRemote()
    setTimeout(() => {
      pollingCheckTodayJournal()
    }, 10 * 1000)
  }
})

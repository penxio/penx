import { Buffer } from 'buffer'
import { isDesktop, WorkerEvents } from '@penx/constants'
import { pollingBackupToGoogle } from './pollingBackupToGoogle'
import { pollingCheckTodayJournal } from './pollingCheckTodayJournal'
import { pollingCloudSync } from './pollingCloudSync'
import { pollingCreateEmbeddings } from './pollingCreateEmbeddings'
import { pollingSyncToRemote } from './pollingSyncToRemote'

self.Buffer = Buffer

self.addEventListener('message', async (event) => {
  if (event.data === WorkerEvents.START_POLLING) {
    console.log('===========start polling......')
    // pollingBackupToGoogle()
    // pollingCloudSync()

    pollingSyncToRemote()

    if (isDesktop) {
      pollingCreateEmbeddings()
    }

    setTimeout(() => {
      pollingCheckTodayJournal()
    }, 10 * 1000)
  }
})

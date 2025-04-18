import { HTTPError } from 'ky'
import { sleep } from '../utils'

const GOOGLE_DRIVE_FOLDER_NAME = 'penx-'

const timeMap: Record<string, number> = {
  '10m': 10 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
}

const GOOGLE_DRIVE_BACKUP_INTERVAL = timeMap['10']

export async function pollingBackupToGoogle() {
  let pollingInterval = 10 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  // while (true) {
  //   console.log('sync to google')
  //   await sleep(pollingInterval)
  // }
}

async function sync() {
  //
}

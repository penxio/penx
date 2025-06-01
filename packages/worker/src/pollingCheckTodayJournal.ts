import { WorkerEvents } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { sleep } from '@penx/utils'

export async function pollingCheckTodayJournal() {
  let pollingInterval = 60 * 1000

  while (true) {
    await check()
    await sleep(pollingInterval)
  }
}

async function check() {
  // console.log(
  //   '=====>>>>WorkerEvents.CHECK_TODAY_JOURNAL:',
  //   WorkerEvents.CHECK_TODAY_JOURNAL,
  // )

  // const areas = await localDB.listAreas()
  // console.log('=======areas:', areas)
  // const journals = await localDB.listJournals()
  // console.log('=============journals:', journals)

  postMessage({
    type: WorkerEvents.CHECK_TODAY_JOURNAL,
  })
}

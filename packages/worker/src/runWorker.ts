import { WorkerEvents } from '@penx/constants'
import { store } from '@penx/store'

// @ts-ignore
// import MyWorker from './worker.ts?worker'

// const worker = new MyWorker()

export function runWorker() {
  console.log('init web worker...')
  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
  })

  worker.onmessage = async (event: MessageEvent<any>) => {
    // console.log(`WebWorker Response => ${JSON.stringify(event.data)}`)
    if (event.data.type === WorkerEvents.CHECK_TODAY_JOURNAL) {
      try {
        await store.journals.checkTodayJournal()
      } catch (error) {}
    }
  }
  worker.postMessage(WorkerEvents.START_POLLING)
}

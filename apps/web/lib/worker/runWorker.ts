import { store } from '@/store'
import { WorkerEvents } from '../constants'

export function runWorker() {
  // console.log('init web worker...')
  // const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  //   type: 'module',
  // })
  // worker.onmessage = async (event: MessageEvent<number>) => {
  //   console.log(`WebWorker Response => ${event.data}`)
  //   if (event.data === WorkerEvents.PUSH_FAILED) {
  //   }
  // }
  // worker.postMessage(WorkerEvents.START_POLLING)
}

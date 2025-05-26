// import { WorkerEvents } from './constants'

export async function sync(isWorker = false) {}

async function pushToServer(remoteLastUpdatedAt: number) {}

async function pullFromServer(localLastUpdatedAt: number, isWorker = false) {}

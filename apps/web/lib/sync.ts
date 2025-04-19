import { WorkerEvents } from './constants'
import { api } from '@penx/trpc-client'

export async function sync(isWorker = false) {}

async function pushToServer(remoteLastUpdatedAt: number) {}

async function pullFromServer(localLastUpdatedAt: number, isWorker = false) {}

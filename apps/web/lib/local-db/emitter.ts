import { INode } from '@/lib/model'
import mitt from 'mitt'

export type DBEvents = {
  REF_NODE_UPDATED: INode
}

export const emitter = mitt<DBEvents>()

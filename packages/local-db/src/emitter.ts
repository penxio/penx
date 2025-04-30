import { INode } from '@penx/model-type'
import mitt from 'mitt'

export type DBEvents = {
  REF_NODE_UPDATED: INode
}

export const emitter = mitt<DBEvents>()

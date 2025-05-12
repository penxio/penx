import { Table } from 'dexie'
import { IAreaNode, INode, NodeType } from '@penx/model-type'
import { penxDB } from '../penx-db'

export class NodeDomain {
  constructor(private n: Table<INode, string>) {}

  listNodesBySiteId = (siteId: string) => {
    return this.n.where({ spaceId: siteId }).toArray()
  }

  listNodesByIds = (nodeIds: string[]) => {
    return this.n.where('id').anyOf(nodeIds).toArray()
  }

  deleteNodeByIds = (nodeIds: string[]) => {
    return this.n.where('id').anyOf(nodeIds).delete()
  }
}

export const nodeDomain = new NodeDomain(penxDB.node)

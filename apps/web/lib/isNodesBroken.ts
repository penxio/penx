import { INode, NodeType } from '@penx/model'

export function isNodesBroken(nodes: INode[]) {
  const set = new Set([
    NodeType.ROOT,
    NodeType.DATABASE_ROOT,
    NodeType.DAILY_ROOT,
  ])

  for (const node of nodes) {
    if (set.has(node.type)) set.delete(node.type)
  }

  return set.size !== 0
}

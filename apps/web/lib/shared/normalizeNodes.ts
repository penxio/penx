import { INode } from '@penx/model'

export const normalizeNodes = (nodes: INode[]) => {
  const nodeMap = new Map<string, INode>()

  for (const node of nodes) {
    nodeMap.set(node.id, node)
  }

  // rm invalid children
  for (const item of nodes) {
    item.children = item.children.filter((id) => nodeMap.get(id))
  }

  return nodes
}

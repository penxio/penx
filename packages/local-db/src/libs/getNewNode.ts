import { INode, NodeType } from '@penx/model'
import { uniqueId } from '@penx/unique-id'

type Input = {
  userId: string
  parentId?: string
  type?: NodeType
  name?: string
  props?: INode['props']
  date?: string
  element?: any[]
}

export function getNewNode(input: Input): INode {
  return {
    id: uniqueId(),
    type: NodeType.COMMON,
    props: input.props || {},
    collapsed: false,
    folded: true,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...input,
  } as INode
}
